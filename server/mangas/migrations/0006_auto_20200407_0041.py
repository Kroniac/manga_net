# Generated by Django 3.0.5 on 2020-04-06 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mangas', '0005_auto_20200407_0032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mangas',
            name='last_updated',
            field=models.IntegerField(null=True),
        ),
    ]
