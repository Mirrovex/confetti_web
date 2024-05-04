#!/bin/bash

# Build the project
echo "Building the project..."
python3.10 -m pip install -r requirements.txt

echo "Make Migrations..."
python3.10 manage.py makemigrations
python3.10 manage.py migrate

echo "Collect Static..."
python3.10 manage.py collectstatic --clear