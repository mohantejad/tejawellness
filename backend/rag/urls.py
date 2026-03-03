from django.urls import path
from .views import RAGChatView

urlpatterns = [
    path("rag-chat/", RAGChatView.as_view()),
]
