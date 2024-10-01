# Threads.net Clone

## Introduction
This is a social media platform inspired by Threads.net, where users can create accounts, make posts, interact with content, and explore various profiles. The platform allows text posts, images (up to 4 per post), and rich user engagement features like likes, comments, bookmarks, and more. The platform is built using **Next.js**, **Prisma**, **auth.js**, and **NeonDB**.

NOTE: this project is a clone of Threads.net and is intended for educational purposes only. It is not affiliated with the original Threads.net platform.
TODO: Make it responsive for mobile devices.

![alt text](https://github.com/R1ck404/Threads-Clone/blob/master/public/demo.png)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
  - [User Features](#user-features)
  - [Core Pages](#core-pages)
- [Server Actions](#server-actions)
  - [User Authentication & Profile](#user-authentication--profile)
  - [Post Interactions](#post-interactions)
  - [User Engagement](#user-engagement)
  - [Search](#search)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Image Upload](#image-upload)
- [Database Schema (Prisma)](#database-schema-prisma)
  - [User Model](#user-model)
  - [Post Model](#post-model)
  - [Follow Model](#follow-model)
  - [Reply Model](#reply-model)
  - [Like Model](#like-model)
  - [Bookmark Model](#bookmark-model)
  - [Setting Model](#setting-model)
- [Project Setup](#project-setup)
  - [Tools & Technologies](#tools--technologies)
  - [Prisma Setup](#prisma-setup)
  - [Development Commands](#development-commands)
- [Conclusion](#conclusion)

---

## Features

### User Features:
1. **Create an Account**: Users can register using a username, email, and password.
2. **Edit Profile**: Users can update their profile information (username, bio, avatar).
3. **Create a Post**: Users can write posts with up to 4 images and text content.
4. **Delete a Post**: Users can delete their own posts.
5. **Comment on a Post**: Users can reply to other users' posts.
6. **Like a Post**: Users can like posts.
7. **Bookmark a Post**: Users can save posts for later viewing.
8. **Search**: Users can search for posts, other users, or tags.
9. **View User Profiles**: Each user has a profile showing their bio, posts, and engagement.
10. **Recent Activity**: Users can view their latest activity, including comments, likes, and follows.

### Core Pages:
1. **/login**: Allows users to log into their account.
2. **/register**: Registration page for new users.
3. **/@[USERNAME]**: User profile page displaying the user’s info, posts, followers, and following.
4. **/@[USERNAME]/posts/[POST_ID]**: Single post detail page.
5. **/activity**: Shows recent activity under four tabs (followers, likes, comments, all).
6. **/bookmarks**: Displays all bookmarked posts.
7. **/profile**: Shows the logged-in user's profile page.
8. **/profile/edit**: Allows users to edit their profile.
9. **/search**: Search page for finding posts, users, and tags.

---

## Server Actions

### User Authentication & Profile
- **registerUser**: Registers a new user with a username, email, and password.
- **getUser**: Retrieves a user's profile information (cached with `unstable_cache`).
- **updateUser**: Updates the user profile including bio and avatar.

### Post Interactions
- **createPost**: Creates a new post with text and optional images (up to 4).
- **deletePost**: Deletes a post authored by the user.
- **getPost**: Retrieves a specific post by ID.
- **getPosts**: Retrieves multiple posts, typically for timelines or user profiles.
- **commentOnPost**: Allows users to comment on a specific post.
- **getComments**: Fetches all comments for a specific post (cached with `unstable_cache`).

### User Engagement
- **toggleLikeOnPost**: Adds or removes a like on a specific post.
- **toggleBookmarkOnPost**: Adds or removes a post from a user's bookmarks.
- **getLikes**: Retrieves likes for a post (cached with `unstable_cache`).
- **getBookmarks**: Retrieves all bookmarks saved by a user (cached with `unstable_cache`).
- **toggleFollow**: Follows or unfollows a specific user.
- **isFollowing**: Checks if one user is following another.
- **getFollowers**: Fetches followers of a specific user (cached with `unstable_cache`).
- **followUser**: Allows one user to follow another.
- **unfollowUser**: Allows one user to unfollow another user.

### Search
- **searchPosts**: Search for posts based on keywords or tags.
- **searchUsers**: Search for users by username or profile content.

---

## API Endpoints

### Authentication
- **/api/auth**: Manages user authentication (login, register, etc.).

### Image Upload
- **/api/upload_images**: Handles image uploads, used in post creation and avatar updates.

---

## Database Schema (Prisma)

### User Model
The `User` model stores user account details including:
- **id**: Unique user identifier.
- **username**: Unique username.
- **email**: Unique email.
- **bio**: Optional user bio.
- **avatarUrl**: Optional URL to the user’s avatar.
- **posts**: List of posts created by the user.
- **followers**: List of users following this user.
- **followedUsers**: List of users followed by this user.
- **settings**: User-specific settings such as theme preferences.

### Post Model
The `Post` model stores details about user posts:
- **id**: Unique post identifier.
- **content**: Post content (text).
- **imageUrl**: Optional URL to the images in the post.
- **author**: References the user who created the post.
- **likes**: List of likes the post has received.
- **bookmarks**: List of bookmarks the post has received.

### Follow Model
The `Follow` model tracks relationships between users (follower and followed):
- **followerId**: ID of the user following someone.
- **followedId**: ID of the user being followed.

### Reply Model
The `Reply` model tracks comments on posts:
- **content**: Text content of the reply.
- **postId**: The post that this reply is linked to.

### Like Model
The `Like` model tracks likes on posts:
- **userId**: The user who liked the post.
- **postId**: The post that was liked.

### Bookmark Model
The `Bookmark` model tracks posts that users have bookmarked:
- **userId**: The user who bookmarked the post.
- **postId**: The post that was bookmarked.

### Setting Model
The `Setting` model stores user-specific settings:
- **theme**: User-selected theme (e.g., light or dark).
- **notifications**: Boolean indicating if notifications are enabled.

---

## Project Setup

### Tools & Technologies
- **Next.js**: The core framework for building the front-end and server-side functionality.
- **auth.js**: Handles authentication (login, registration, session management).
- **Prisma**: An ORM for database interactions.
- **NeonDB**: The PostgreSQL database used for data storage.

### Prisma Setup
To generate Prisma client and set up the database:
```bash
npx prisma migrate dev -n initial-setup
npx prisma db seed
```

### Development Commands
- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run start`**: Runs the production build.
- **`npm run lint`**: Runs linting for code quality.

---

## Conclusion
This social media platform allows users to engage in rich content creation and interaction, with a focus on user experience, profile customization, and social interaction. Built using cutting-edge tools like Next.js and Prisma, it ensures scalability, performance, and a modern feature set ideal for social networking platforms.
