from django_filters import rest_framework as filters
from mangas.models import Mangas

class MangasFilter(filters.FilterSet):
    class Meta:
        model = Mangas
        fields = {
            "title": ["icontains", "iexact"],
        }