from django.urls import include, path
from rest_framework.authtoken import views as drf_views
from . import views

from knox.views import LogoutView

urlpatterns = [

    path('auth/', drf_views.obtain_auth_token, name='auth'),

    # Authentication endpoints    
    path('api/admin/auth/', include('knox.urls')),
    path("admin/auth/register/", views.RegistrationAPI.as_view()),
    path("admin/auth/login/", views.LoginAPI.as_view()),
    path('admin/auth/logout/', LogoutView.as_view(), name='knox_logout'),
    path("admin/auth/user/", views.UserAPI.as_view()),
    path("admin/auth/changePassword/", views.PasswordChangeAPI.as_view()),
    path("admin/auth/updateInfo/", views.InfoChangeAPI.as_view()),
    
    # recipe part
    path("admin/recipe/new/", views.RecipeAPI.as_view()), # post
    path("admin/recipe/<int:pk>/", views.RecipeAPI.as_view()), # edit
    path("recipe/<int:pk>/details/", views.RecipeAPI.as_view()), # get
    path("admin/recipe/<int:pk>", views.RecipeAPI.as_view()), # delete
    path("admin/recipeall_prefill/<int:pk>/", views.GetRecipeByUserId.as_view()),

    # newsfeed
    path("admin/newsfeed/", views.NewsFeedByUserId.as_view()),

    # ifsub
    path("admin/ifsub/<int:pk>/", views.ifSub.as_view()),
    
    # Basket 
    path("admin/addtobasket/<int:pk>/", views.Basket.as_view()), # post method
    path("admin/deletefrombasket/<int:pk>", views.Basket.as_view()),# delete method
    path("admin/ifinbasket/<int:pk>/", views.Basket.as_view()), # get method

    path("admin/basketclear/", views.BasketClear.as_view()), # delete method

    # Basket info & summary
    path("admin/viewbasketrecipes/", views.BasketRecipe.as_view()), # get method
    path("admin/viewbasketsummary/", views.BasketSummary.as_view()), # get method

    # Recommendation
    path("admin/recommendation/<int:pk>/", views.Recommendation.as_view()), # get method
    # Top ten recipes
    path("recipe/top/", views.TopRecipes.as_view()),

    # Comments Part 
    path('recipe/comments/<int:pk>/', views.CommentAPI.as_view()),
    
    # profile
    path("admin/recipeall/<int:pk>/", views.RecipeListByUserId.as_view()),
    path("admin/recipe/list/", views.RecipeListBySelfId.as_view()),
    path("admin/user/<int:pk>/", views.Profile.as_view()),

    # Like
    path('recipe/<int:pk>/like/', views.LikeRecipeAPI.as_view()),

    # Subscription
    path('user/subscribe/', views.SubscribeAPI.as_view()),

    # Search
    path('recipe/search/', views.Search.as_view()),
]
