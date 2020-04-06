from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Mangas(models.Model):
    id = models.CharField(primary_key=True, max_length=24)
    alias = models.TextField(max_length=30)
    categories = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    hits= models.IntegerField(null=True)
    status = models.IntegerField(null=True)
    title = models.TextField(null=True)
    last_updated = models.IntegerField(null=True)
    image = models.TextField(null=True)

