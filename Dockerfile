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
