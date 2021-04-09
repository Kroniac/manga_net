import base64
import io
from datetime import datetime

import requests

from PIL import Image
from bs4 import BeautifulSoup

from rest_framework.response import Response
from rest_framework import status

MANGAS_BASE_URL = "https://m.manganelo.com/"
MANGA_BASE_URL = "https://chap.manganelo.com/"


def fetch_manga_data():
    mangas = []
    maanga_statuses = ["ongoing"]

    for manga_status in maanga_statuses:
        last_page = 1
        current_page = 1
        while current_page <= last_page:
            url = (
                MANGAS_BASE_URL
                + "genre-all/"
                + str(current_page)
                + "?type=topview&state="
                + manga_status
            )
            page = requests.get(url)
            soup = BeautifulSoup(page.content, "html.parser")
            results = soup.find_all("div", class_="content-genres-item")
            for r in results:
                a_link = r.find("a", class_="genres-item-img")
                image = a_link.find("img", "img-loading")["src"]
                manga_link = a_link["href"]
                title = a_link["title"]
                views = r.find("span", "genres-item-view").text.strip()
                last_updated_raw = r.find("span", "genres-item-time").text.strip()
                last_updated = datetime.timestamp(
                    datetime.strptime(last_updated_raw, "%b %d,%y")
                )
                ratings_el = r.find("em", "genres-item-rate")
                ratings = ratings_el.text.strip() if ratings_el else None
                mangas.append(
                    {
                        "id": manga_link.split("-")[1],
                        "hits": int(views.replace(",", "")),
                        "title": title,
                        "link": manga_link,
                        "ratings": ratings,
                        "last_updated": last_updated,
                        "status": manga_status,
                        "image": image,
                    }
                )
            print(url)
            page_no_wrapper = soup.find("div", class_="panel-page-number")
            last_page = (
                page_no_wrapper.find("a", class_="page-last")
                .text.split("(")[1]
                .split(")")[0]
            )
            last_page = int(last_page)
            print(last_page, current_page)
            current_page += 1
    return mangas


def fetch_manga_info(manga_id):
    link = MANGA_BASE_URL + "manga-" + manga_id
    page = requests.get(link)

    if page.status_code != status.HTTP_200_OK:
        return Response(status=page.status_code)

    try:
        soup = BeautifulSoup(page.content, "html.parser")
        result = soup.find("div", class_="panel-story-info")
        image_container = result.find("div", class_="story-info-left")
        image_container = image_container.find("span", class_="info-image")
        image_el = image_container.find("img", class_="img-loading")
        image_link = image_el["src"]

        manga_info_container = result.find("div", class_="story-info-right")
        manga_title = manga_info_container.find("h1").text.strip()
        detail = manga_info_container.find("table", class_="variations-tableInfo")
        details_results = detail.find_all("tr")
        alias = ""
        for d in details_results:
            title = d.find("td", class_="table-label").text.strip()
            value = d.find("td", class_="table-value").text.strip()

            if title == "Alternative :":
                alias = value
            if title == "Genres :":
                categories = value.split(" - ")
            if title == "Author(s) :":
                author = value

        extra_detail_wrapper = manga_info_container.find(
            "div", class_="story-info-right-extent"
        )
        extra_details = extra_detail_wrapper.find_all("p")
        for d in extra_details:
            title = d.find("span", class_="stre-label")
            value = d.find("span", class_="stre-value")

            if title is None:
                break

        description = (
            result.find(id="panel-story-info-description")
            .text.strip()
            .split("Description :")[1]
        )

        chapters_wrapper = soup.find("div", class_="panel-story-chapter-list")
        chapters_eles = chapters_wrapper.find_all("li", class_="a-h")
        chapters = []
        for c in chapters_eles:
            a_link = c.find("a", class_="chapter-name")
            chapter_link = a_link["href"]
            chapter_index = chapter_link.split("-")[-1]
            chapter_name = a_link.text.strip()
            chapter_date = c.find("span", class_="chapter-time")["title"].strip()

            chapters.append(
                {
                    "id": chapter_index,
                    "last_updated": datetime.timestamp(
                        datetime.strptime(chapter_date, "%b %d,%Y %H:%M")
                    ),
                    "title": chapter_name,
                    "link": chapter_link,
                }
            )

        return Response(
            status=status.HTTP_200_OK,
            data={
                "id": manga_id,
                "alias": alias,
                "categories": categories,
                "chapters_len": len(chapters),
                "description": description,
                "image": image_link,
                "imageURL": image_link,
                "last_chapter_date": chapters[0]["last_updated"],
                "chapters": chapters,
                "title": manga_title,
                "author": author,
            },
        )
    except (AttributeError, IndexError) as e:
        return Response(status=status.HTTP_404_NOT_FOUND)


def fetch_manga_chapter(chapter_id):
    manga_id = chapter_id.split("-")[0]
    url = MANGA_BASE_URL + "manga-" + manga_id + "/chapter-" + chapter_id.split("-")[1]
    page = requests.get(url)

    if page.status_code != status.HTTP_200_OK:
        return Response(status=page.status_code)

    try:
        soup = BeautifulSoup(page.content, "html.parser")
        panel_breadcrumb_el = soup.find("div", class_="panel-breadcrumb")
        bread_crumb_els = panel_breadcrumb_el.find_all("a")
        title = bread_crumb_els[2]["title"]
        manga_title = bread_crumb_els[1]["title"]

        chapters_els = soup.find("select", class_="navi-change-chapter")
        chapters_els = chapters_els.find_all("option")
        chapters = [
            {"number": chapter["data-c"], "title": chapter.text}
            for chapter in chapters_els
        ]

        navigate_page_wrapper_el = soup.find("div", class_="navi-change-chapter-btn")
        prev_page_wrapper = navigate_page_wrapper_el.find(
            "a", class_="navi-change-chapter-btn-prev"
        )
        prev_chapter_id = (
            prev_page_wrapper["href"].split("-")[-1] if prev_page_wrapper else None
        )
        next_page_wrapper = navigate_page_wrapper_el.find(
            "a", class_="navi-change-chapter-btn-next"
        )
        next_chapter_id = (
            next_page_wrapper["href"].split("-")[-1] if next_page_wrapper else None
        )

        pages_wrapper = soup.find("div", class_="container-chapter-reader")
        pages = pages_wrapper.find_all("img")
        images = []
        for index, p in enumerate(pages):
            images.append(
                {"id": f"{chapter_id}{index}", "url": p["src"], "alt": p["alt"]}
            )

        return Response(
            status=status.HTTP_200_OK,
            data={
                "prev_chapter_id": prev_chapter_id,
                "next_chapter_id": next_chapter_id,
                "images": images,
                "title": title,
                "manga_title": manga_title,
                "chapters": chapters,
            },
        )
    except (AttributeError, IndexError):
        return Response(status=status.HTTP_404_NOT_FOUND)


def compress_image(image):
    output = io.BytesIO()
    new_image = Image.open(io.BytesIO(image))
    new_image.save(
        output, format="JPEG", compression="pil_1024*768_q85", optimize=True,
    )


def get_manga_chapter_image(link):
    headers = {"referer": "https://manganelo.com/"}
    r = requests.get(link, stream=True, headers=headers,)
    if r.status_code == 200:
        new_image = Image.open(io.BytesIO(r.content))
        width, height = new_image.size
        encoded_string = base64.b64encode(r.content)
        image = encoded_string.decode("utf-8")
        return Response(
            status=status.HTTP_200_OK,
            data={"image_binary": image, "width": width, "height": height},
        )
    return Response(status=r.status_code)
