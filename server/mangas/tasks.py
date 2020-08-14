from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from mangas import updater


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(updater.sync_manga_image_dims, "interval", minutes=1)
    scheduler.start()
