 Penniel Car Hire 🚗

A premium, full-stack vehicle rental management system designed for the Kenyan market. This platform provides a seamless experience for users to browse a high-quality fleet, book vehicles in real-time, and manage their rental accounts.

 Key Features
Dynamic Fleet Management**: Real-time vehicle availability fetched from a MongoDB database.
Responsive UI/UX: Built with Tailwind CSS for a mobile-first, high-performance experience.
Smart Booking System: Integrated modal booking form with automated price formatting and validation.
Geolocation Integration: One-tap live location capturing for precise delivery/pickup coordination.
WhatsApp Support: Floating quick-action button for immediate customer assistance.
Secure Authentication: Backend user registration with hashed password storage.

 Tech Stack

Frontend:
 HTML5 & CSS3 (Custom Scrollbars & Hero Animations)
 [Tailwind CSS](https://tailwindcss.com/) (Styling)
 Vanilla JavaScript (DOM Manipulation & Fetch API)
 Font Awesome (Iconography)

Backend:
 [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
 [MongoDB](https://www.mongodb.com/) with Mongoose (Database)
 JSON Web Tokens (JWT) & Bcrypt (Security)
 CORS Middleware

 Getting Started

 Prerequisites
 Node.js (v14+ recommended)
 MongoDB Atlas account or local MongoDB instance

 Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/penniel-car-hire.git](https://github.com/your-username/penniel-car-hire.git)
   cd penniel-car-hire

Project Structure
├── public/
│   ├── index.html      # Main frontend
├── routes/
│   ├── cars.js         # Fleet API endpoints
│   └── users.js        # Auth & Booking endpoints
├── models/
│   ├── Car.js          # MongoDB Schema for vehicles
│   └── User.js         # MongoDB Schema for clients
├── server.js           # Express server configuration
└── .env                # Environment variables
   

   
