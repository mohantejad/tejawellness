from django.apps import AppConfig


class RagConfig(AppConfig):
    name = 'rag'

    def ready(self):
        import rag.signals
