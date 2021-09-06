from rest_framework import serializers
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model
from .models import Recipe_info_model

User = get_user_model()

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'nick_name', 'password', 'email')
        # extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'nick_name', 'email')

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'oldpassword' 'newpassword')

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        else:
            raise serializers.ValidationError("Incorrect Credentials. Please try again.")

# class RecipeCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Recipe_info_model
#         fields = ('ingredients', 'cookingMethod', 'mealType','recipeTitle','steps', 'photo')
        
