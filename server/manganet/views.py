from django.http import HttpResponse


def index(request):
    return HttpResponse("Mangas By Kroniac")
