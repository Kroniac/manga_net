import requests
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
