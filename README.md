# Grand Hotel - Luxury Stays 🏨✨

A premium, full-stack hotel booking platform featuring a sleek modern UI, secure authentication, real-time booking, and integrated payment simulation.

## 🚀 Key Features Implemented

### 1. **Authentication System** 🔐
- **Secure Signup/Login**: JWT-based authentication for secure user sessions.
- **OTP Verification**: Email-based OTP verification for account activation.
- **Forgot/Reset Password**: Complete password recovery workflow.
- **Protected Routes**: Secure access to booking and profile pages.

### 2. **Hotel Discovery** 🔍
- **Dynamic Search**: Search hotels by name, location, or city with real-time results.
- **Advanced Filtering**: Filter by price range, star rating, and luxury categories.
- **Detailed Hotel Pages**: High-quality image galleries, facility lists, and descriptions.
- **Responsive Map (Leaflet)**: Interactive location view (safely handled with fallbacks).

### 3. **Booking & Reservation** 📅
- **Two-Step Checkout**: A streamlined flow from date selection to payment.
- **Live Price Calculator**: Dynamic calculation including room multipliers, service fees, and cleaning fees.
- **Room Types**: Support for Standard, Deluxe, and Suite selections.
- **Booking History**: Users can track their upcoming and past stays in the 'My Stays' section.

### 4. **Payment System (Simulated)** 💳
- **Secure Card Entry**: Realistic credit/debit card input form with validation.
- **Order Creation**: Backend integration for generating pending booking orders.
- **Payment Verification**: Instant booking confirmation upon successful simulated payment.
- **Success Feedback**: Gorgeous success screens with redirection.

### 5. **Hotel Reviews & Ratings** ⭐
- **User Ratings**: 1-5 star rating system for verified hotel experiences.
- **Guest Reviews**: Ability for logged-in users to share detailed comments.
- **Instant Updates**: New reviews appear in real-time on the hotel details page.
- **Average Ratings**: Dynamically updated hotel ratings based on community feedback.

---

## 🛠️ Technology Stack

### **Frontend**
- **React.js**: Modern UI library for a dynamic experience.
- **Vite**: Rapid development and build tool.
- **Vanilla CSS**: Premium, custom-crafted styling for a unique brand identity.
- **Lucide React**: Sleek, consistent iconography.
- **React Leaflet**: Open-source maps for location visualization.

### **Backend**
- **Node.js & Express**: Robust and scalable server infrastructure.
- **Prisma ORM**: Modern database access and schema management.
- **PostgreSQL**: Reliable relational database for storing hotels, users, and bookings.
- **JWT**: Industry-standard secure authentication.

---

## 📂 Project Structure

- `/frontend`: React application, styling, and API services.
- `/backend`: Express server, Prisma models, and API controllers.
- `/backend/prisma`: Database schema and migration settings.

---

## 🛠️ How to Run

1. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

*Enjoy your stay at Grand Hotel!* 🥂
