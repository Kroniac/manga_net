from rest_framework import serializers

from mangas.models import Mangas, MangaInfo


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
            "image",
            "last_updated",
        )


class MangaInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MangaInfo
        fields = (
            "id",
            "alias",
            "created",
            "description",
            "image",
            "imageURL",
            "last_chapter_date",
            "released",
            "startsWith",
        )
