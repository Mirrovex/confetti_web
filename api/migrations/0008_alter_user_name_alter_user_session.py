# Generated by Django 5.0.3 on 2024-05-04 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_rename_count_user_click"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="name",
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="session",
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
