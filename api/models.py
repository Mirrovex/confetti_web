from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50, unique=True)
    click = models.IntegerField(default=0, blank=True)
    speed = models.FloatField(default=0, blank=True)
    visits = models.IntegerField(default=0, blank=True)
    session = models.CharField(max_length=50, null=True, blank=True)
    joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
