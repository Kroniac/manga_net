# Generated by Django 3.0.5 on 2020-04-11 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    operations = [
        migrations.CreateModel(
            name="MangaInfo",
            fields=[
                (
                    "id",
                    models.CharField(max_length=24, primary_key=True, serialize=False),
                ),
                ("alias", models.TextField(max_length=30)),
            ],
        ),
    ]
