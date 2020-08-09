from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _

from mangas.manga_eden import fetch_manga_info


# Create your models here.


class Mangas(models.Model):
    class STATUS(models.TextChoices):
        # SUSPENDED = 0, _("Suspended")
        ONGOING = "ongoing", _("Ongoing")
        COMPLETED = "completed", _("Completed")
        __empty__ = _("(Unknown)")

    id = models.CharField(primary_key=True, max_length=8)
    # alias = models.TextField(max_length=30)
    # categories = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    hits = models.IntegerField(null=True)
    status = models.TextField(choices=STATUS.choices)
    title = models.TextField(null=True)
    last_updated = models.IntegerField(null=True)
    image = models.TextField(null=True)
    image_width = models.FloatField(null=True)
    image_height = models.FloatField(null=True)
    link = models.TextField(null=True)
    ratings = models.FloatField(null=True)

    class Meta:
        ordering = ["-hits"]


class MangaInfo(models.Model):
    id = models.CharField(primary_key=True, max_length=24)
    alias = models.TextField(max_length=30)
    categories = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    chapters_len = models.IntegerField()
    description = (models.TextField(),)
    image = (models.TextField(null=True),)
    imageURL = models.TextField(null=True)
    last_chapter_date = models.IntegerField(null=True)


class MangaChapters(models.Model):
    id = models.CharField(primary_key=True, max_length=24)
    last_updated = models.IntegerField(null=True)
    title = models.TextField()
    manga_info = models.ForeignKey(
        MangaInfo, related_name="chapters", on_delete=models.PROTECT
    )
