# Care.xyz

A web application for booking trusted care services for children and elderly.

## Setup

1.  **Clone/Download** the repository.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create `.env.local` in the root directory and add:
    ```env
    MONGODB_URI=mongodb://localhost:27017/care-xyz
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_secret_key
    # Google OAuth (Optional)
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    ```
4.  **Seed Database**:
    To populate initial services, visit:
    `http://localhost:3000/api/seed`
    (Or make a GET request to it)
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
6.  **Open**: `http://localhost:3000`

## Features

-   **Home**: Browse services (Baby Care, Elderly Care, Special Care).
-   **Service Details**: View pricing and features.
-   **Booking**: Book a service (requires login). Calculates total cost dynamically.
-   **My Bookings**: View and cancel bookings.
-   **Auth**: Email/Password and Google Login (configured via env).

## Tech Stack

-   **Next.js 15+** (App Router)
-   **JavaScript** (No TypeScript)
-   **Tailwind CSS**
-   **MongoDB** & Mongoose
-   **NextAuth.js**
