from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import UserAccount, UserProfile


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = UserAccount
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class UserProfileSerializer(BaseUserSerializer):
    class Meta:
        model = UserProfile
        fields = ('skin_type', 'hair_type', 'hair_texture', 'skin_concerns', 'hair_concerns')

class UserSerializer(BaseUserSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta(BaseUserSerializer.Meta):
        model = UserAccount
        fields = ('id', 'email', 'first_name', 'last_name', 'profile')