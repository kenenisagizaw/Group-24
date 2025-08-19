FROM python:3.12-slim

WORKDIR /app

# Install dependencies first for better caching
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# Copy application code
COPY app.py /app/app.py

EXPOSE 5000

CMD ["python", "app.py"]


