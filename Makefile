migrations:
	python manage.py makemigrations

migrate:
	python manage.py migrate

admin:
	python manage.py createsuperuser

app:
	django-admin startapp $(word 2, $(MAKECMDGOALS))

up:
	python manage.py runserver

local:
	python manage.py runserver 192.168.0.23:8000

deploy:
	python manage.py runserver 0.0.0.0:30000

shell:
	python manage.py shell