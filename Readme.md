# Arcade

This repository features the classic Pacman game, built with Three.js. The project is split into two parts: arcade-backend and arcade-frontend. The backend is built with Node.js, Express, and Prisma, while the frontend uses Three.js and Vite.

## Installation

To install and run the project, follow these steps:

1. Clone the repository:
```
git clone https://github.com/yuridesideri/arcade.git
```

2. Install dependencies for both the frontend and backend:
```
cd arcade/arcade-backend
npm install
```
```
cd ../arcade-frontend
npm install
```

3. Start the backend server:
```
cd ../arcade-backend
npm run dev
```

4. Start the frontend server:
```
cd ../arcade-frontend
npm run dev
```

## Configuration

### Backend

You can configure the backend server by setting some of the following environment variables (follow .env.example rules):

- `DATABASE_URL`: The URL of the PostgreSQL database. Defaults to `postgres://localhost:5432/arcade`.
- `PORT`: The port number to run the server on. Defaults to `3000`.

### Frontend

You can configure the frontend server by setting the following environment variables (follow .env.example rules):

- `VITE_API_BASE_URL`: The base URL of the backend API.

## License

This project is licensed under the [MIT license](https://github.com/yuridesideri/arcade/blob/main/LICENSE).
