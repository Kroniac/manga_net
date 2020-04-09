from rest_framework import viewsets
from django_filters import rest_framework as filters
from mangas.serializers import MangasSerializer

from mangas.filters import MangasFilter

from mangas.models import Mangas

from manganet.pagination import StandardResultsSetPagination


class MangasViewSet(viewsets.ModelViewSet):
    serializer_class = MangasSerializer
    queryset = Mangas.objects.all()
    pagination_class = StandardResultsSetPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = MangasFilter
