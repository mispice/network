from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.core.paginator import Paginator


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
    post = Posts.objects.all()
    post= post.order_by("-date_Posted").all()
    paginator = Paginator(post,10)
    page = request.GET.get('page')
    post_List = paginator.get_page(page)
    return JsonResponse([posts.serialize() for posts in post_List], safe=False)

@login_required
def following_Posts(request):
    followings = following.objects.filter(user = request.user)
    for follow in followings:
        post = (Posts.objects.filter(User = follow.following))
    post = post.order_by("-date_Posted").all()
    return JsonResponse([posts.serialize() for posts in post],safe=False)

@login_required      
def profile(request,user_id):
    user = User.objects.get(username = user_id)
    post = Posts.objects.filter(User = user.id)
    post = post.order_by("-date_Posted").all()
    return JsonResponse([posts.serialize() for posts in post],safe=False)

@login_required
#displays the number of users a profile has
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

@csrf_exempt
@login_required
def follow(request,user_name):
    if request.method != "POST":
        return JsonResponse({"error": "Post request required"}, status=400)
    data =  json.loads(request.body)
    posts = data.get("follow")
    followings = following.objects.all()
    update_followings = following()
    user_Obj = User.objects.get(username=user_name)
    counter = 0
    for users_followed in followings:
        if users_followed.user == request.user and users_followed.following == user_Obj:
            counter +=1
    if counter == 1:
        data = {
            "message": "Already followed user"
        }
        return JsonResponse(data, safe=False)
    print(request.user)
    if user_Obj == request.user:
        data= {
            "message": "you can't follow yourself"
        }
        return JsonResponse(data,safe=False)
    elif counter != 1 and user_Obj != request.user:
            update_followings.user = request.user
            update_followings.following = user_Obj
            update_followings.save()
            data = {
                "message": "Successfully followed user"
            }
            return JsonResponse(data, safe=False)

@csrf_exempt
@login_required
def unfollow(request,user_name):
    if request.method != "POST":
        return JsonResponse({"error": "Post request required"}, status=400)
    data =  json.loads(request.body)
    posts = data.get("unfollow")
    followings = following.objects.all()
    user_Obj = User.objects.get(username=user_name)
    counter = 0
    for users_followed in followings:
        if users_followed.user == request.user and users_followed.following == user_Obj:
            counter +=1
    if counter == 1:
        update_followings = following.objects.filter(user=request.user,following = user_Obj)
        update_followings.delete()
        data = {
            "message": "Successfully unfollowed user"
        }
        return JsonResponse(data, safe=False)
    else:
        data = {
            "message": "You haven't followed the user yet"
        }
        return JsonResponse(data, safe=False)

@csrf_exempt
@login_required
def like(request,post_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        like = data.get("like")
        if data.get("like") is not None:
            post = Posts.objects.get(id = post_id)
            print(post.likes)
            post.likes += int(like)
            post.save()
        return JsonResponse({"message": "successfully Updated"}, status = 201)

@csrf_exempt
@login_required
def dislike(request,post_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        dislike = data.get("dislike")
        if data.get("dislike") is not None:
            post = Posts.objects.get(id = post_id)
            print(post.likes)
            post.dislikes += int(dislike)
            post.save()
        return JsonResponse({"message": "successfully Updated"}, status = 201)

@csrf_exempt
@login_required
def edit(request,post_id):

    if request.method == "POST":
        data =  json.loads(request.body)
        posts = data.get("post")
        post = Posts.objects.get(id = post_id)
        post.post = posts
        post.save()
        return JsonResponse({"message": "successfully posted"}, status = 201)

    posts= Posts.objects.get(id = post_id)
    if(request.user == posts.User):
        data = {
        "post":posts.post
        }
        return JsonResponse(data,safe=False)
    else:
        data = {
            "message": "you can only edit your post"
        }
        return JsonResponse(data,safe=False)