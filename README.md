# OLX Clone - Full Stack MERN Application

A modern, responsive, and minimal full-stack OLX clone built using the MERN stack (MongoDB, Express, React, Node.js). 

## Features

- **Authentication:** JWT-based user authentication (Register, Login, Protected Routes).
- **Product Management:** Users can post ads with details, prices, and upload up to 5 images.
- **Image Upload:** Integrated with Cloudinary for fast and reliable cloud image storage.
- **Search & Filter:** Search for products by keyword and filter by category.
- **Responsive UI:** Modern, clean, OLX-inspired UI built with Tailwind CSS v4.
- **My Listings:** Users can manage (view, delete) their own ads.

## Tech Stack

- **Frontend:** React.js (Vite), React Router v6, Tailwind CSS v4, Context API, Axios, React Hot Toast.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Image Handling:** Multer, Cloudinary, Streamifier.
- **Security:** bcrypt, jsonwebtoken, CORS.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string (local or Atlas)
- Cloudinary Account (Cloud Name, API Key, API Secret)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "olx clone"
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Rename `.env.example` to `.env` or create a `.env` file in the `backend` directory.
   - Update the variables:
     ```env
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_key
     JWT_EXPIRE=30d
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   - Open `frontend/vite.config.js` and verify proxy setup if needed, or update `frontend/src/utils/api.js` to point to `http://localhost:5000/api` if you are running servers separately. By default `api.js` uses relative `/api` path.
   - For dev mode without proxy in vite, update `frontend/src/utils/api.js` baseURL to `http://localhost:5000/api`.

### Running the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Clean Architecture Details
- **Controllers:** Business logic separated from routes.
- **Middleware:** Reusable auth and upload handlers.
- **Context API:** Lightweight global state for user authentication.
- **Custom Utility Classes:** Using Tailwind `@layer utilities` for DRY code.
