# Generated by Django 3.0.5 on 2020-07-04 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mangas', '0013_mangainfo_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mangas',
            name='hits',
            field=models.IntegerField(null=True),
        ),
    ]
