Chuks Kitchen API 👨‍🍳
A robust, production-ready backend solution for Chuks Kitchen, a digital food ordering platform. This project implements secure user authentication, role-based access control, and a high-integrity ordering system designed to handle the complexities of a modern food delivery business.

🚀 Live Demo
API Base URL: https://chuks-kitchen-api.onrender.com 

### 🏗️ System Architecture
The system design and request flow can be viewed here: [Eraser.io Diagram](https://app.eraser.io/workspace/YrU7uzav8ZArKvaFTZFi?origin=share)

🛠 Features
1. User Authentication & Access Flow
OTP Verification: Secure email-based registration using Nodemailer and 6-digit One-Time Passwords with a 10-minute expiry window.

JWT Security: Stateless authentication using JSON Web Tokens stored in HTTP-only cookies to prevent XSS and CSRF attacks.

Role-Based Access Control (RBAC): Distinct permissions for Customers and Admins (Mr. Chuks).

2. Product Management
Menu Catalog: Customers can browse real-time available food items.

Admin Dashboard Logic: Restricted endpoints for adding, updating, and managing food availability and stock.

3. Ordering System Logic
Server-Side Price Validation: Protects business revenue by ignoring client-side prices and fetching the "Source of Truth" directly from MongoDB.

Availability Guards: Automated checks to ensure items are in stock and marked as isAvailable before processing payments.

Order Tracking: Status-based lifecycle management (Pending → Confirmed → Preparing → Delivered).

🏗 System Architecture
This project follows the MVC (Model-View-Controller) pattern for scalability and clean code separation.

Runtime: Node.js

Framework: Express.js

Database: MongoDB via Mongoose

Email Service: SMTP (Gmail/Nodemailer)

Security: Bcrypt (Password Hashing) & JWT (Authentication)

📂 API Endpoints Summary
Authentication
Products & Orders
🧠 Documented Thinking (Design Decisions)
Why OTP? I chose OTP over simple email links to ensure users stay within the app flow, increasing conversion while maintaining high security.

Data Integrity: Orders are calculated server-side to prevent "parameter tampering" where a user might attempt to change a meal's price in the browser's inspect tool.

Middleware Pipeline: I implemented a dual-layer middleware (protectRoute → adminRoute) to ensure that even if a customer is authenticated, they cannot access administrative business data.

⚙️ Setup Instructions
Clone the repository: git clone https://github.com/your-username/chuks-kitchen-api.git

Install dependencies: npm install

Configure your .env file (see .env.example)

Start the server: npm run dev

Developed for the TrueMinds Innovations Backend Assessment.

One Final Tip:
Make sure to include a file in your repo called .env.example that lists the keys (not the actual values!) so the reviewers know what variables to set.
