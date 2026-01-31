# Deployment Guide

This guide explains how to deploy the Multi-Tenant SaaS application to a Virtual Private Server (VPS) such as AWS EC2, DigitalOcean Droplet, or Google Compute Engine.

## Prerequisites
- A Linux server (Ubuntu 20.04/22.04 LTS recommended).
- A domain name (optional, but recommended for production).
- SSH access to the server.

## Step 1: Server Setup

1.  **SSH into your server**:
    ```bash
    ssh query@your-server-ip
    ```

2.  **Update packages**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

3.  **Install Docker & Docker Compose**:
    ```bash
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh

    # Add user to docker group (avoid sudo for docker commands)
    sudo usermod -aG docker $USER
    newgrp docker
    ```

## Step 2: Deploy Application

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Susmitha-coder-hub/multi-tenant-saas-modified.git
    cd multi-tenant-saas-modified
    ```

2.  **Configuration**:
    *   Review `docker-compose.yml`.
    *   For production, you might want to create a `.env` file instead of hardcoding values in `docker-compose.yml`, but for this submission, the current setup works out of the box.

3.  **Start the Application**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Verify Deployment**:
    ```bash
    docker-compose ps
    ```
    Ensure all containers (`database`, `backend`, `frontend`) are up.

## Step 3: Accessing the App

- **Frontend**: `http://your-server-ip:3000`
- **Backend API**: `http://your-server-ip:5000`

## Step 4: Production Considerations (Optional)

For a real-world production deployment, you should:

1.  **Set up Nginx as a Reverse Proxy**:
    - Route port 80/443 to port 3000 (Frontend) and 5000 (Backend).
2.  **SSL Certificates**:
    - Use Certbot (Let's Encrypt) to secure your domain with HTTPS.
3.  **Firewall**:
    - Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS).
    - Block ports 3000, 5000, 5432 from external access if using Nginx.
