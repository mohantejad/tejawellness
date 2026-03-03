from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import exceptions


class CustomJWTAuthentication(JWTAuthentication):
    '''
    Auth Priority:
        1) Authorization header (JWT)
        2) access_token cookie
    '''
    def authenticate(self, request):
        try:
            header = self.get_header(request)
            if header is None:
                raw_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS)
            else:
                raw_token = self.get_raw_token(header)
                
            if raw_token is None:
                return None 
            
            # Validate the token and resolve the user.
            validated_token = self.get_validated_token(raw_token)

            return self.get_user(validated_token), validated_token
        except InvalidToken as e:
            raise exceptions.AuthenticationFailed("Invalid access token") from e
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Authentication error: {str(e)}")
            return None