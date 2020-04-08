from rest_framework import viewsets

from mangas.serializers import MangasSerializer

from mangas.models import Mangas

from manganet.pagination import StandardResultsSetPagination


class MangasViewSet(viewsets.ModelViewSet):
    serializer_class = MangasSerializer
    queryset = Mangas.objects.all()
    pagination_class = StandardResultsSetPagination
