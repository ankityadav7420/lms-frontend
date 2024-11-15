# LMS (Learning Management System) with Adaptive Testing

This LMS project provides adaptive testing capabilities, user authentication, and role-based access control. It has two main components:

1. Backend: Built with nodejs, MongoDB, and JWT for authentication.
2. Frontend: Built with Next.js and Material UI for UI components.

---

## Getting Started

Follow these steps to clone the project, set up the environment, and run the backend and frontend.

## Backend Setup

1. Run the seeder script to add dummy question

```bash
        node seedQuestions.js
```

1. **Clone the Repository**

```bash
        git clone <repository_url>
        cd <repository_name>
        npm install  ( backend)
        npm start
```

## Frontend Setup

1. **Clone the Repository**

```bash
   git clone <repository_url>
   cd <repository_name>
   npm install  ( frontend)
   npm run dev
```

# Usage

1.Register and Login
Open the frontend at http://localhost:3000, then:
• Go to the register page, enter your email and password to register.
• After registering, log in with the same credentials.

2.Start the Test
•Once logged in, navigate to the home page and click “Start Test” to begin the adaptive test.
•Each question is fetched from the backend, and your answers are submitted one by one.
•On test completion, candidates can view their score. Admin users can view complete test details, including all questions and scores, via a unique URL.
