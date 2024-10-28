# Blogging Website Client side

Welcome to our Blogging Website powered by Vite and React! This web application allows editors to create, edit, and save drafts of blog posts. Additionally, it features a notification system and a comment section for each blog. Admins have access to a dedicated dashboard for managing and overseeing the blogging activities.

# Live Preview

ByteBlogger: https://byteblogger-vipin.netlify.app

## Features

- Create and Edit Blogs: Editors can create new blog posts and edit existing ones.
- Save Drafts: Editors have the option to save blog posts as drafts before publishing.
- Notification System: Users receive notifications for important events or interactions.
- Comment Section: Each blog post includes a comment section for engaging with readers.
- Admin Dashboard: Admins have access to a dedicated dashboard for managing the blogging platform.
- Blog Dashboard: Editors can view a dashboard summarizing their blogging activities.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (comes with Node.js)

## Installation

### Using Docker

#### add a .env file in frontend directory with environment variables like

      #VITE_HOST_URL=http://localhost:3000
      #VITE_STRIPE_KEY=your stripe public key
      #VITE_CLOUD_NAME=your cloudinary cloud name
      #VITE_UPLOAD_PRESET=your cloudinary upload preset
      #VITE_FIREBASE_API_KEY=your firebase API key
      #VITE_MESSAGING_SENDER_ID=your firebase messaging sender id
      #VITE_FIREBASE_APP_ID=your firebase app id

<details>
<summary><code>Dockerfile</code></summary>

```Dockerfile

# Use the official Node.js 20-alpine as a base image
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine

# Create app directory
WORKDIR /app

# Use environment variables at build time for Vite
ARG VITE_HOST_URL
ARG VITE_STRIPE_KEY
ARG VITE_CLOUD_NAME
ARG VITE_UPLOAD_PRESET
ARG VITE_FIREBASE_API_KEY
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Make the environment variables available during build time
ENV VITE_HOST_URL=${VITE_HOST_URL}
ENV VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
ENV VITE_CLOUD_NAME=${VITE_CLOUD_NAME}
ENV VITE_UPLOAD_PRESET=${VITE_UPLOAD_PRESET}
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_MESSAGING_SENDER_ID=${VITE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}

# Copy package.json and package-lock.json to take advantage of caching
COPY package*.json ./

# Install dependencies using build-time environment variables
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app for production
RUN npm run build

# Expose the port that Vite will use
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]

```

</details>

<details>
<summary><code>docker-compose.yaml</code></summary>

```dockerfile
# specify the version of docker-compose
version: "3.8"
services:
 # define the frontend service
  # we can use any name for the service. A standard naming convention is to use "web" for the frontend
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_HOST_URL: ${VITE_HOST_URL}
        VITE_STRIPE_KEY: ${VITE_STRIPE_KEY}
        VITE_CLOUD_NAME: ${VITE_CLOUD_NAME}
        VITE_UPLOAD_PRESET: ${VITE_UPLOAD_PRESET}
        VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY}
        VITE_MESSAGING_SENDER_ID: ${VITE_MESSAGING_SENDER_ID}
        VITE_FIREBASE_APP_ID: ${VITE_FIREBASE_APP_ID}
    # specify the ports to expose for the web service
    # the first number is the port on the host machine
    # the second number is the port inside the container
    ports:
      - "5173:5173"
    # specify the environment variables for the web service
    environment:
      - VITE_HOST_URL=${VITE_HOST_URL}
      - VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
      - VITE_CLOUD_NAME=${VITE_CLOUD_NAME}
      - VITE_UPLOAD_PRESET=${VITE_UPLOAD_PRESET}
      - VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
      - VITE_MESSAGING_SENDER_ID=${VITE_MESSAGING_SENDER_ID}
      - VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
    # define the volumes to be used by the services
    volumes:
      - .:/app
      - /app/node_modules

```

</details>

#### Creating Images from .yaml file

docker-compose build

### Adding frontend image to backend compose file

<div align="center">
<a href="https://github.com/vipinpatidar/ByteBlogger-server-code" target="_blank">
Go to backend github repo and download or clone it. Use it's Dockerfile and docker-compose.yaml file by adding created frontend image
</a>
</div>

<br />
<br />
## Using Github clone

1.  Clone the repository:
    git clone https://github.com/your-username/blog-website.git

2.  Navigate to the project directory:
    cd blog-website

3.  Install dependencies:
    npm install

## Connecting to Backend

<div>
<a href="https://github.com/vipinpatidar/ByteBlogger-server-code" target="_blank">
for connection to backend you can add my ByteBlogger-server code and clone it. for more information read server Readme.md file
</a>
</div>

Locate the .env file in the project root.

Update the .env variable:

- VITE_HOST_URL=backend port url
- VITE_STRIPE_KEY=stripe secret key

## Usage

Start the development server:npm run dev
