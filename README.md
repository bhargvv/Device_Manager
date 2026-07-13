# Device Management System

A full-stack web application for managing company devices. The system allows users to add, edit, delete, search, and view device information stored in a MySQL database through a React-based interface and a Node.js/Express backend.

## Features

* Add new devices
* Edit existing device details
* Delete devices
* Search devices
* View all devices
* Store data in a MySQL database

## Tech Stack

**Frontend**

* React.js
* CSS
* Axios

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

## Project Structure

```text
Device-Management/
│
├── backend/
├── frontend/
└── README.md
```

## Prerequisites

Before running the project, install:

* Node.js
* npm
* MySQL Server
* Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/device-management.git
cd device-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=device_management
```

Create the MySQL database:

```sql
CREATE DATABASE device_management;
```

Start the backend:

```bash
npm start
```

or

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/devices`     | Get all devices    |
| GET    | `/devices/:id` | Get a device by ID |
| POST   | `/devices`     | Add a new device   |
| PUT    | `/devices/:id` | Update a device    |
| DELETE | `/devices/:id` | Delete a device    |

## Screenshots

*Add screenshots of the application here.*

## Author

**Bhargav**
