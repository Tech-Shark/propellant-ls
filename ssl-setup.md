# SSL Certificate Setup

To run the application with HTTPS enabled, you need to provide SSL certificates.

## Using Let's Encrypt Certificates

1. Create a directory for your certificates:

```
mkdir -p certs
```

2. If using Let's Encrypt, copy your certificates to the `certs` directory:

```
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem certs/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem certs/
```

3. Run the application using Docker Compose:

```
docker-compose up -d
```

## Using Self-Signed Certificates (Development Only)

For development environments, you can create self-signed certificates:

```bash
# Generate a self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/privkey.pem -out certs/fullchain.pem -subj "/CN=localhost"
```

Note: Self-signed certificates will cause browser warnings. They should only be used for development.
