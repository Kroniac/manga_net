import requests
import io
from PIL import Image

from mangas.models import Mangas
from mangas.serializers import MangasSerializer
from mangas.manga_eden import fetch_manga_data
from mangas.manga_fetcher import fetch_manga_data


def update_manga_data():
    print("hello")
    mangas = fetch_manga_data()
    # if json is not None:
    #     data = []
    #     for x in json["manga"]:
    #         if "ld" in x and "ld" is not None:
    #             data.append(
    #                 {
    #                     "alias": x["a"],
    #                     "categories": x["c"],
    #                     "id": x["i"],
    #                     "image": x["im"],
    #                     "status": x["s"],
    #                     "title": x["t"],
    #                     "hits": x["h"],
    #                     "last_updated": x["ld"],
    #                 }
    #             )

    MangasSerializer(many=True).create(mangas)


def get_image_dimensions_from_url(url):
    res = requests.get(url, stream=True, headers={"referrer": "no-referrer"})
    if res.status_code == 200:
        new_image = Image.open(io.BytesIO(res.content))
        print(new_image.size)
        width, height = new_image.size
        return {
            "width": width,
            "height": height,
        }


def update_manga_image_dims():
    mangas = Mangas.objects.filter(
        image_width__isnull=True, image_height__isnull=True
    ).all()

    print(len(mangas))
    for manga in mangas:
        image_dims = get_image_dimensions_from_url(manga.image)
        Mangas.objects.filter(id=manga.id).update(
            image_width=image_dims["width"], image_height=image_dims["height"],
        )
        manga.image_width = image_dims["width"]
        manga.image_height = image_dims["height"]
        manga.save()
