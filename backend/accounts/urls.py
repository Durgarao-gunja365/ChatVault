from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, get_user_profile, update_user_profile, change_password
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("me/", get_user_profile, name="get_user_profile"),
path("me/update/", update_user_profile, name="update_user_profile"),
path("change-password/", change_password, name="change_password"),

    path("register/", RegisterView.as_view(), name="register"),
    path("login/", MyTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
