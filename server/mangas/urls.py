from django.conf.urls import url, include
from django.urls import path
from rest_framework.routers import SimpleRouter

from mangas import views

router = SimpleRouter()

router.register(r"mangas", views.MangasViewSet, basename="mangas")
# router.register(r"manga_info", views.MangaInfoView.as_view(), basename="mangas")

urlpatterns = [
    url(r"^", include(router.urls)),
    path("manga_info/<str:pk>/", views.MangaInfoView.as_view()),
    path("chapter/<str:pk>/", views.MangaChapterView.as_view()),
]
