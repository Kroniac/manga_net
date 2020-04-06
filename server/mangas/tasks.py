from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from mangas import updater


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(updater.update_manga_data, "interval", minutes=1)
    scheduler.start()
