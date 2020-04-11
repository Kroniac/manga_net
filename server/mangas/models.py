from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _


# Create your models here.


class Mangas(models.Model):
    class STATUS(models.IntegerChoices):
        SUSPENDED = 0, _("Suspended")
        ONGOING = 1, _("Ongoing")
        COMPLETED = 2, _("Completed")
        __empty__ = _("(Unknown)")

    id = models.CharField(primary_key=True, max_length=24)
    alias = models.TextField(max_length=30)
    categories = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    hits = models.IntegerField(null=True)
    status = models.SmallIntegerField(choices=STATUS.choices)
    title = models.TextField(null=True)
    last_updated = models.IntegerField(null=True)
    image = models.TextField(null=True)

    class Meta:
        ordering = ["-hits"]
