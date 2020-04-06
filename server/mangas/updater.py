import requests
from mangas.models import Mangas
from mangas.serializers import MangasSerializer

def get_manga_data():
    url = 'https://www.mangaeden.com/api/list/0/'
  
    r = requests.get(url)

    try:
        r.raise_for_status()
        return r.json()
    except:
        return None

def update_manga_data():
    json = get_manga_data()
    if json is not None:
        data = []
        for x in json["manga"]:
            if "ld" in x and "ld" is not None:
                data.append({
                    "alias": x["a"],
                    "categories": x["c"],
                    "id": x["i"],
                    "image": x["im"],
                    "status": x["s"],
                    "title": x["t"],
                    "hits": x["h"],
                    "last_updated": x["ld"]
                })
        print(data)
        MangasSerializer(many=True).create(data)
      
# def update_forecast():
#     json = _get_forecast_json()
#     if json is not None:
#         try:
#             new_forecast = Forecast()
            
#             # open weather map gives temps in Kelvin. We want celsius.              
#             temp_in_celsius = json['main']['temp'] - 273.15
#             new_forecast.temperatue = temp_in_celsius
#             new_forecast.description = json['weather'][0]['description']
#             new_forecast.city = json['name']
#             new_forecast.save()
#             print("saving...\n" + new_forecast)
#         except:
#             pass