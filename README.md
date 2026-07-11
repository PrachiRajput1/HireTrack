# HireTrack

HireTrack is a modern, full-stack Applicant Tracking System (ATS) built with Node.js, Express, MongoDB, and EJS. It features a premium, responsive UI with distinct dashboards for both Recruiters and Candidates.

## Features

- **Recruiter Portal**: Post job openings, manage candidates through a Kanban pipeline, and view analytics.
- **Candidate Portal**: Apply for jobs, update professional profiles, and track application statuses.
- **Dynamic Kanban Board**: Seamlessly move candidates between stages (Screening, Interview, Hired, etc.).
- **Rich User Profiles**: Built-in settings page for users to add skills, bios, and links to their GitHub/LinkedIn.
- **Secure Authentication**: JWT-based login with hashed passwords via bcrypt.
- **Modern UI/UX**: Premium "Cream & Light Yellow" glassmorphic design system.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017 or a MongoDB Atlas URI)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd HireTrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Rename the `.env.example` file to `.env` and fill in the necessary values:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure your `MONGO_URI` is correct and generate secure random strings for `JWT_SECRET` and `SESSION_SECRET` in a production environment.*

4. **Seed the Database (Optional but Recommended):**
   To populate the database with realistic dummy data (Recruiters, Candidates, Jobs, and Applicants), run the included seeder script:
   ```bash
   npm run seed
   ```
   *(Or run `node seed.js` directly).*
   
   **Test Accounts from Seed Data:**
   - Recruiter 1: `admin@test.com` / `password123`
   - Recruiter 2: `hr@test.com` / `password123`
   - Candidate: `candidate@test.com` / `password123`

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *(Or run `node server.js` directly).*

6. **Open in Browser:**
   Navigate to `http://localhost:5000` to view the application.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Frontend:** EJS Templating Engine, Vanilla CSS (Custom Design System), Bootstrap 5 for layout grid
- **Security:** bcrypt, jsonwebtoken, cookie-parser

## License

This project is licensed under the MIT License.
