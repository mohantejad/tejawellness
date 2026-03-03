import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import groq

from rag.search import search_embeddings
from main.recommendations import score_goals_for_user

client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

class RAGChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        question = request.data.get("question", "")
        if not question:
            return Response({"error": "Missing question"}, status=400)

        preferred_goals = []
        if request.user and request.user.is_authenticated:
            scores = score_goals_for_user(request.user)
            preferred_goals = [gid for gid, score in sorted(scores.items(), key=lambda x: x[1], reverse=True) if score > 0]
            # convert goal ids to slugs
            if preferred_goals:
                from goals.models import Goal
                preferred_goals = list(
                    Goal.objects.filter(id__in=preferred_goals).values_list("slug", flat=True)
                )

        results = search_embeddings(
            question,
            top_k=6,
            content_types=["recipe", "product", "ingredient", "meal_plan", "goal"],
            preferred_goals=preferred_goals or None,
        )

        if len(results) < 6:
            extras = search_embeddings(
                question,
                top_k=6,
                content_types=["recipe", "product", "ingredient", "meal_plan", "goal"],
                preferred_goals=None,
            )
            seen = {(r.content_type, r.object_id) for r in results}
            for e in extras:
                key = (e.content_type, e.object_id)
                if key in seen:
                    continue
                results.append(e)
                seen.add(key)
                if len(results) >= 6:
                    break

        context = "\n".join([f"{r.content_type.upper()}: {r.text}" for r in results])

        prompt = f"""
You are Teja Wellness AI coach. Keep answers short and actionable (3-6 sentences max).
Use bullet points if listing steps. Use the context only if relevant.

Context:
{context}

Question: {question}
"""

        if not results:
            return Response({
                "answer": "I couldn’t find a close match yet. Try asking about skin, hair, recipes, or products for your goal.",
                "recommendations": [],
            })

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        return Response({
            "answer": response.choices[0].message.content,
            "recommendations": [
                {"type": r.content_type, "id": r.object_id, "title": r.metadata.get("title", ""), "meta": r.metadata}
                for r in results
            ]
        })
