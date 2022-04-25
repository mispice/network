
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API PATHS
    path("new_Post", views.new_Post ,name="new_Post"),
    path("display", views.display, name="display"),
    path("following",views.following_Posts,name="following_Posts"),
    path("profile/<str:user_id>",views.profile,name="profile"),
    path("follower/<str:user_id>",views.follower, name="follower")
]


