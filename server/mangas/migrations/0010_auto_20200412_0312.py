# Generated by Django 3.0.5 on 2020-04-11 21:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mangas', '0009_mangainfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='mangainfo',
            name='chapters_len',
            field=models.IntegerField(default=123),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mangainfo',
            name='created',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='mangainfo',
            name='imageURL',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='mangainfo',
            name='last_chapter_date',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='mangainfo',
            name='released',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='mangainfo',
            name='startsWith',
            field=models.CharField(max_length=1, null=True),
        ),
        migrations.CreateModel(
            name='MangaChapters',
            fields=[
                ('id', models.CharField(max_length=24, primary_key=True, serialize=False)),
                ('last_updated', models.IntegerField(null=True)),
                ('index', models.TextField()),
                ('title', models.TextField()),
                ('manga_info', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='chapters', to='mangas.MangaInfo')),
            ],
        ),
    ]