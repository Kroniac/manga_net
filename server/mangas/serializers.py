from rest_framework import serializers

from mangas.models import Mangas, MangaInfo


class MangasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mangas
        fields = (
            "id",
            "hits",
            "title",
            "link",
            "ratings",
            "last_updated",
            "status",
            "image",
            "image_width",
            "image_height",
        )


class MangaInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MangaInfo
        fields = (
            "id",
            "alias",
            "categories",
            "description",
            "image",
            "imageURL",
            "last_chapter_date",
        )
