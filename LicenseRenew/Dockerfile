FROM python:3.10-slim-buster


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list && \
    apt-get update -o Acquire::Check-Valid-Until=false && \
    apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        libpq-dev gcc \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libgdk-pixbuf2.0-0 \
        libffi-dev \
        libcairo2 \
        libglib2.0-0 \
        fonts-liberation \
        fonts-dejavu-core && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN groupadd -r celerygroup && useradd -r -g celerygroup celeryuser


WORKDIR /project


COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt
    

COPY . . 

USER root

RUN python manage.py collectstatic --noinput

RUN mkdir -p /project/media && chown -R celeryuser:celerygroup /project

USER celeryuser

EXPOSE 8000

CMD ["gunicorn", "LicenseRenew.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]