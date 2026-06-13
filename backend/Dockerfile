FROM python:3.11-slim

WORKDIR /app

COPY requirements/ ./requirements/
RUN pip install -r requirements/prod.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "bioshop.wsgi", "--bind", "0.0.0.0:8000", "--log-file", "-"]