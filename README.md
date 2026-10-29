I thought of making this project because I hate the idea of formal learning. I prefer informal learning myself and feel best at ease then. This is a simple skill-sharing platform where learners, teachers, or simply anyone can teach and learn anything they want. You can do both simultaneously. Nobody in this world is a know-it-all. We all are learners throughout our lives. You know how to code?, how to crochet a mug coaster?, got some tricks on how to improve handwriting? It can be anything! Just add these in your skills, then specify your slots when you are free and can teach someone. Others will see it and book your class. It's just that simple.

Happy Learning!

I just want to create a safe space where we all can just learn things because we want to, without any pressure of any kind. I hope we all find our love for learning. I am trying to find my way back. Hope you can do the same. xx

now all the technical stuff :)

# PeerSchool – Skill Sharing Platform

PeerSchool is a full-stack web application where people can teach skills they know and learn new skills from others. Users can offer skills, book learning sessions, and connect through online meetings — all for free.

## Live Demo

- **Frontend:** [PeerSchool](https://peer-school.vercel.app/)
- **Backend:** [Render](https://peer-school.onrender.com/)

## Features

- **User Authentication:** Register, log in, log out, and change passwords securely.
- **User Profiles:** Add a bio, profile picture, and skills you want to learn.
- **Skill Listings:** Create, edit, delete, search, and browse skills offered by other users.
- **Session Booking:** Browse available time slots and request learning sessions.
- **Booking Management:** Instructors can confirm or cancel requests, and users can track their sessions.
- **Email Notifications:** Receive emails about booking requests, confirmations, cancellations, and session updates.
- **Online Meetings:** Automatically generate Jitsi Meet links when a session is confirmed.
- **Reviews and Ratings:** Learners can rate instructors and leave feedback after completed sessions.
- **Dashboard:** View upcoming sessions, completed activities, and ratings.
- **Responsive Design:** Use the application on desktop and mobile devices.

## Technologies Used

| Part | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt.js |
| Email | Nodemailer, Gmail SMTP |
| Video Meetings | Jitsi Meet |
| Other Tools | Axios, Git, GitHub, Postman |
| Deployment | Vercel (frontend), Render (backend) |

## How It Works

1. Create an account and complete your profile.
2. Add a skill you can teach and set your available time slots.
3. Browse the skills offered by other users.
4. Select a skill and request a session at an available time.
5. The instructor receives an email notification and can confirm the request.
6. Once confirmed, both users receive an email containing the session details and a Jitsi Meet link.
7. After the session is completed, the learner can leave a review.

## Project Structure

The project has two main folders:

- `client/` – Contains the React frontend, pages, components, and API calls.
- `server/` – Contains the Express backend, API routes, controllers, database models, and email functionality.

## Running the Project Locally

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account or another MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/amna-1111/peer-school.git
cd peer-school
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder and add the configuration required by your backend, including:

- MongoDB connection URI
- JWT secret
- Gmail SMTP credentials for sending emails
- Frontend URL for CORS configuration, if required

Use the exact environment variable names expected by your server code. For Gmail, use an App Password rather than your regular account password.

Start the backend using the development command defined in `server/package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
```

Configure the frontend API base URL to point to your local backend, following the environment variable setup used in your client code.

Start the frontend using the command defined in `client/package.json`:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## Deployment

The application is deployed using separate services:

- **Vercel:** Hosts the React frontend.
- **Render:** Runs the Express backend.
- **MongoDB Atlas:** Stores application data in the cloud.

The frontend communicates with the backend through API requests. Environment variables are configured in the hosting platforms to connect the services.

## Security

- Passwords are hashed before being stored.
- JWT authentication protects private API routes.
- Users can only modify resources they are authorized to manage.
- Environment variables keep database credentials and other secrets out of the source code.


---

**Built with the MERN stack.**
