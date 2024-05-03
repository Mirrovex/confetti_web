from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username