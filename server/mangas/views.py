from rest_framework import viewsets

from mangas.serializers import MangasSerializer

from mangas.models import Mangas

class MangasViewSet(viewsets.ModelViewSet):
    serializer_class = MangasSerializer
    queryset = Mangas.objects.all()
