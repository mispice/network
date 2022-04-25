from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def new_Post(request):
    if request.method != "POST":
        return JsonResponse({"error": "Post request required"}, status=400)
    data =  json.loads(request.body)
    posts = data.get("post")
    if posts == "":
        return JsonResponse({"error: Post should include one or more characters"}, status=400)
    post = Posts()
    post.post = posts
    post.User = request.user
    post.save()
    return JsonResponse({"message": "successfully posted"}, status = 201)

def display(request):
    post = Posts.objects.exclude(User = request.user)
    post= post.order_by("-date_Posted").all()
    return JsonResponse([posts.serialize() for posts in post], safe=False)

@login_required
def following_Posts(request):
    followings = following.objects.filter(user = request.user)
    for follow in followings:
        post = (Posts.objects.filter(User = follow.following))
    post.order_by("-date_Posted").all()
    return JsonResponse([posts.serialize() for posts in post],safe=False)
        
def profile(request,user_id):
    user = User.objects.get(username = user_id)
    post = Posts.objects.filter(User = user.id)
    post = post.order_by("-date_Posted").all()
    return JsonResponse([posts.serialize() for posts in post],safe=False)
    
def follower(request,user_id):
    user = User.objects.get(username = user_id)
    followings = following.objects.filter(user = user)
    follower = following.objects.filter(following = user)
    counter_Follower = 0
    counter_Following = 0
    for follow in followings:
        counter_Following+=1
    for follow in follower:
        counter_Follower+=1
    data = {
        "counter_Follower":counter_Follower,
        "counter_Following":counter_Following
    }
    return JsonResponse(data,safe=False)