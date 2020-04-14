from rest_framework import viewsets
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from mangas.serializers import MangasSerializer, MangaInfoSerializer

from mangas.filters import MangasFilter

from mangas.models import Mangas, MangaInfo

from manganet.pagination import StandardResultsSetPagination
from mangas.manga_eden import fetch_manga_info


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
