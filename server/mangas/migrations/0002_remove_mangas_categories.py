# Generated by Django 3.0.5 on 2020-04-06 18:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mangas', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mangas',
            name='categories',
        ),
    ]
