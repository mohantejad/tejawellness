from django.db.models import Q
from rag.embenddings import get_embedding
from rag.models import Embedding
from pgvector.django import CosineDistance


def search_embeddings(query: str, top_k=5, content_types=None, preferred_goals=None):
    q_emb = get_embedding(query)
    qs = Embedding.objects.all()
    if content_types:
        qs = qs.filter(content_type__in=content_types)

    if preferred_goals:
        qs = qs.filter(
            Q(metadata__goal__in=preferred_goals) |
            Q(content_type__in=["ingredient", "goal"])
        )

    return list(qs.order_by(CosineDistance("embedding", q_emb))[:top_k])
