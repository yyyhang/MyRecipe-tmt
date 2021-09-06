from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import module_loading


class UserInfo(AbstractUser):
    nick_name = models.CharField(max_length=256)

class Recipe_info_model (models.Model):
    recipe_id = models.AutoField(primary_key=True)
    created_by_user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    recipe_title = models.CharField(max_length=256, null=True, blank=True)
    ingredients = models.JSONField()
    steps = models.JSONField(null=True)
    cooking_method = models.CharField(max_length=256, null=True, blank=True)
    meal_type = models.CharField(max_length=256, null=True, blank=True)
    photo = models.TextField()
    updated = models.DateTimeField()

class Comment(models.Model):
    recipe = models.ForeignKey('Recipe_info_model',on_delete=models.CASCADE)
    content = models.CharField(max_length=8000, null=True, blank=True)
    created_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_by_user = models.ForeignKey(UserInfo, related_name="+", on_delete=models.CASCADE) # No need for backwards relations
    # updated_data = models.DateTimeField(auto_now=True, null=True, blank=True)

class Subscription(models.Model):
    contributor = models.ForeignKey('UserInfo', related_name="+", on_delete=models.CASCADE)
    subscriber = models.ForeignKey('UserInfo', related_name="+", on_delete=models.CASCADE)

class Like(models.Model):
    user = models.ForeignKey('UserInfo', related_name="+", on_delete=models.CASCADE)
    recipe = models.ForeignKey('Recipe_info_model', on_delete=models.CASCADE)

class Basket_model(models.Model):
    user = models.ForeignKey('UserInfo', related_name="+", on_delete=models.CASCADE)
    recipe = models.ForeignKey('Recipe_info_model', on_delete=models.CASCADE)