# 📍 Pinpoint

**Pinpoint** is a location-based social sharing platform that lets users create and discover experiences tied to real-world locations. Share your favorite spots, travel stories, and hidden gems with the community.

---

## 🚀 Getting Started

### 🔧 Clone the Repository

```bash
git clone https://github.com/CSC105-2024/G16-16-Bit-PreHack-2025.git
cd G16-16-Bit-PreHack-2025
````

---

## 🛠️ Frontend - React

### 🧰 Tech Stack

* React 19
* React Router DOM 7
* Axios (for API requests)
* Tailwind CSS 4
* Google Maps API Integration
* Lucide React (for icons)

### 🚀 Getting Started (React Client)

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder with your Google Maps API key:

```env
VITE_GOOGLE_MAP_API=your_google_maps_api_key
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:
👉 `http://localhost:5173`

---

## 🧪 Backend - Node.js (Hono.js)

### 🛠️ Tech Stack

* Node.js
* Hono.js (for API routing)
* Prisma ORM (with MySQL)
* JWT (for authentication)
* bcrypt (for password hashing)
### 🔐 .env Setup (IMPORTANT)

Create a `.env` file inside the `backend` directory and paste the following:

```env
DATABASE_PROVIDER="mysql"
DATABASE_URL="mysql://user:pass@cshackathon.sit.kmutt.ac.th:3306/group_prehack"
SHADOW_DATABASE_URL="mysql://user:pass@cshackathon.sit.kmutt.ac.th:3306/group_prehack_shadow"

JWT_SECRET="123456"
JWT_EXPIRES_IN="7d"
PORT=3000

CLOUDINARY_CLOUD_NAME="-"
CLOUDINARY_API_KEY="-"
CLOUDINARY_API_SECRET="-"
```

### ⚠️ Notes:


* You can generate a random string for `JWT_SECRET` or use `123456` if testing locally.
* Cloudinary values are placeholders — fill those in with your keys


### 🔌 API Endpoints

| Method | Endpoint               | Description                 | Auth Required |
| ------ | ---------------------- | --------------------------- | ------------- |
| POST   | `/auth/register`       | Register a new user         | ❌             |
| POST   | `/auth/login`          | Login user                  | ❌             |
| POST   | `/auth/logout`         | Logout user                 | ❌             |
| GET    | `/posts`               | Get all posts               | ❌             |
| GET    | `/posts/filter`        | Filter posts by location    | ❌             |
| GET    | `/posts/search`        | Search posts by query       | ❌             |
| GET    | `/posts/:id`           | Get post details            | ❌             |
| GET    | `/users/:userId/posts` | Get posts by user           | ❌             |
| GET    | `/users/me`            | Get current user profile    | ✅             |
| GET    | `/me`                  | Check authentication status | ✅             |
| POST   | `/posts`               | Create a new post           | ✅             |
| PUT    | `/posts/:id`           | Update an existing post     | ✅             |
| DELETE | `/posts/:id`           | Delete a post               | ✅             |
| POST   | `/posts/:id/vote`      | Vote on a post              | ✅             |

---

### 🚀 Getting Started (Node.js Server)

```bash
cd backend
npm install
```

Run server using school DB config:

```bash
npm run dev:school
```

Backend will run on:
👉 `http://localhost:3000`


