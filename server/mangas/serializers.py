from rest_framework import serializers

from mangas.models import Mangas


class MangasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mangas
        fields = (
            "id",
            "alias",
            "categories",
            "hits",
            "status",
            "title",
            "last_updated",
        )
