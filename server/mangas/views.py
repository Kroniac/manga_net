from django_filters import rest_framework as filters
from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from mangas.serializers import MangasSerializer, MangaInfoSerializer

from mangas.filters import MangasFilter

from mangas.models import Mangas

from manganet.pagination import StandardResultsSetPagination

from mangas.logic import (
    get_manga_chapter_image,
    fetch_manga_info,
    fetch_manga_chapter,
)


class MangasViewSet(viewsets.ModelViewSet):
    serializer_class = MangasSerializer
    queryset = Mangas.objects.all()
    pagination_class = StandardResultsSetPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = MangasFilter
    http_method_names = ["get", "options", "head"]


class MangaInfoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if "pk" in self.kwargs:
            data = fetch_manga_info(self.kwargs["pk"])
            print(data)
            if data is None:
                return []
            MangaInfoSerializer().create(data)
            return [data]
        return []

    serializer_class = MangaInfoSerializer
    queryset = get_queryset


class MangaInfoView(APIView):
    serializer_class = MangaInfoSerializer

    def get(self, request, pk):
        res = fetch_manga_info(pk)
        if res.status_code == status.HTTP_404_NOT_FOUND:
            raise Http404
        return Response(status=res.status_code, data=res.data)


class MangaChapterView(APIView):
    def get(self, request, pk):
        res = fetch_manga_chapter(pk)
        if res.status_code == status.HTTP_404_NOT_FOUND:
            raise Http404
        return Response(status=res.status_code, data=res.data)


class MangaChapterPageView(APIView):
    def post(self, request):
        link = request.data["link"]
        res = get_manga_chapter_image(link)
        if res.status_code == status.HTTP_404_NOT_FOUND:
            raise Http404

        return Response(status=res.status_code, data=res.data)
