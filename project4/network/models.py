from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Posts(models.Model):
    User = models.ForeignKey(User,on_delete =models.CASCADE,related_name="user")
    post = models.CharField(max_length = 500)
    date_Posted = models.DateTimeField(auto_now_add= True)
    likes = models.IntegerField(default = 0)
    dislikes = models.IntegerField(default = 0)

    def serialize(self):
        return {
            "user":self.User.username,
            "id": self.id,
            "post": self.post,
            "date_Posted": self.date_Posted.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes,
            "dislikes":self.dislikes
        }

class comment(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete = models.CASCADE, related_name= "comment")
    comment = models.CharField(max_length = 200)
    date_Created = models.DateTimeField(auto_now_add = True)

class followers(models.Model):
    User = models.ForeignKey(User,on_delete=models.CASCADE, related_name="followers")
    follower = models.IntegerField()
    datefollowed = models.DateTimeField(auto_now_add  = True)
class following(models.Model):
    User = models.ForeignKey(User,on_delete=models.CASCADE, related_name="following")
    following = models.IntegerField()
    datefollowing = models.DateTimeField(auto_now_add  = True)
