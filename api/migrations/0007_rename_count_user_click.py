# Generated by Django 5.0.3 on 2024-05-04 18:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_user_session"),
    ]

    operations = [
        migrations.RenameField(model_name="user", old_name="count", new_name="click",),
    ]