from django.apps import AppConfig


class MangasConfig(AppConfig):
    name = 'mangas'

    # def ready(self):
    #     from mangas import tasks
    #     tasks.start()
