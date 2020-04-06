from django.conf.urls import url, include
from rest_framework.routers import SimpleRouter

from mangas import views

router = SimpleRouter()

router.register(r"mangas", views.MangasViewSet, basename="mangas")

urlpatterns = [url(r"^", include(router.urls))]