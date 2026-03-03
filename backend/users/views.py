from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from djoser.social.views import ProviderAuthView


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            if access_token and refresh_token:
                remember_me = str(request.data.get('remember_me', 'false')).lower() == 'true'
                refresh_max_age = (
                    settings.AUTH_COOKIE_REFRESH_MAX_AGE_REMEMBER
                    if remember_me
                    else settings.AUTH_COOKIE_REFRESH_MAX_AGE
                )

                response.set_cookie(
                    settings.AUTH_COOKIE_ACCESS,
                    access_token,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )
                response.set_cookie(
                    settings.AUTH_COOKIE_REFRESH,
                    refresh_token,
                    max_age=refresh_max_age,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )

                # response.data = {'detail': 'Logged in Successful'}

        return response
    

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if not refresh_token:
            return super().post(request, *args, **kwargs)

        data = request.data.copy()
        data['refresh'] = refresh_token
        request._full_data = data 

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            new_refresh = response.data.get('refresh')

            if access_token:
                response.set_cookie(
                    settings.AUTH_COOKIE_ACCESS,
                    access_token,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )

            if new_refresh:
                response.set_cookie(
                    settings.AUTH_COOKIE_REFRESH,
                    new_refresh,
                    max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )

            response.data = {'detail': 'New tokens issued'}

        return response
    
class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS)
        if access_token:
            data = request.data.copy()
            data["token"] = access_token
            request._full_data = data

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(
            settings.AUTH_COOKIE_ACCESS,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
        )
        response.delete_cookie(
            settings.AUTH_COOKIE_REFRESH,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
        )
        return response


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access = response.data.get("access")
            refresh = response.data.get("refresh")

            if access:
                response.set_cookie(
                    settings.AUTH_COOKIE_ACCESS,
                    access,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )
            if refresh:
                response.set_cookie(
                    settings.AUTH_COOKIE_REFRESH,
                    refresh,
                    max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )

            response.data = {"detail": "Logged in with provider"}

        return response
