# Blogging Website Client side

Welcome to our Blogging Website powered by Vite and React! This web application allows editors to create, edit, and save drafts of blog posts. Additionally, it features a notification system and a comment section for each blog. Admins have access to a dedicated dashboard for managing and overseeing the blogging activities.

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

1. Clone the repository:
   git clone https://github.com/your-username/blog-website.git

2. Navigate to the project directory:
   cd blog-website

3. Install dependencies:
   npm install

## Connecting to Backend

for connection to backend you can add my ByteBlogger-server code and clone it. for more information read server Readme.md file

Locate the .env file in the project root.

Update the .env variable:

- VITE_HOST_URL=backend port url
- VITE_STRIPE_KEY=stripe secret key

## Usage

Start the development server:npm run dev
