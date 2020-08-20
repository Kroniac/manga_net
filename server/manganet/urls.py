from django.contrib import admin
from django.urls import path

from django.conf.urls import include, url

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("admin/", admin.site.urls),
    url(r"^mangas/", include("mangas.urls")),
]
