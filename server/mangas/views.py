from rest_framework import viewsets
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.http import Http404, HttpResponse, FileResponse
from rest_framework.response import Response
from mangas.serializers import MangasSerializer, MangaInfoSerializer

from mangas.filters import MangasFilter

from mangas.models import Mangas, MangaInfo

from manganet.pagination import StandardResultsSetPagination
from mangas.manga_fetcher import (
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
        data = fetch_manga_info(pk)
        if data is None:
            raise Http404
        return Response(data)


# class MangaChaptersView(APIView)


class MangaChapterView(APIView):
    def get(self, request, pk):
        data = fetch_manga_chapter(pk)
        if data is None:
            raise Http404
        return Response(data)


class MangaChapterPageView(APIView):
    def post(self, request, *args):
        link = request.data["link"]
        data = get_manga_chapter_image(link)
        if data is None:
            raise Http404

        return Response(data)
