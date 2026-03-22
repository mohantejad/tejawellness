from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class HealthCheckView(APIView):
    """
    Simple endpoint for uptime monitoring services.
    Returns 200 OK to keep the service alive.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "healthy"}, status=status.HTTP_200_OK)
