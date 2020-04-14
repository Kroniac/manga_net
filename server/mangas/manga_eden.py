import requests

base_url = "https://www.mangaeden.com/api/"


def data_fetcher(url):
    r = requests.get(url)

    try:
        r.raise_for_status()
        return r.json()
    except:
        return None


def transform_chapters(chapters):
    return list(
        map(
            lambda x: {"id": x[3], "last_updated": x[1], "index": x[0], "title": x[2],},
            chapters,
        )
    )


def transform_manga_info(info):
    info["chapters"] = transform_chapters(info["chapters"])

    return info


def fetch_manga_data():
    url = base_url + "list/0/"
    data = data_fetcher(url)
    return data


def fetch_manga_info(manga_id):
    url = base_url + "manga/" + manga_id + "/"
    data = data_fetcher(url)
    if data is not None:
        data["id"] = manga_id
        return transform_manga_info(data)
    return None


def fetch_manga_chapter_images(chapter_id):
    url = base_url + "chapter/" + chapter_id + "/"
    data = data_fetcher(url)
    return data
