# Bike Rental Reservation System Backend

Welcome to the backend of the Bike Rental Reservation System. With this application, users can easily register, log in, and rent bikes. You will find instructions for setting up and using the application in this documentation.

## [Live URL (https://bike-rental-system-chi.vercel.app)](https://bike-rental-system-chi.vercel.app)

## Technology Used

-   **Programming Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **ODM**: Mongoose
-   **Validation Library**: Zod
-   **Authentication**: JSON Web Tokens (JWT)

## Features

-   User Registration and Authentication
-   Role Based Access Control: Admin and User Roles with Different Permissions
-   Retrieve and Update User's Own Profile
-   Add, Update and Delete Bike by the Admin
-   Bike Availability and Rental Management
-   Rental Transactions and Cost Calculation
-   Error Handling and Input Validation

# Setup Instruction

Follow this step-by-step guide to run the server on your local machine.

### 1. Clone the Repository

First, clone the repository to your machine using the following command:

```
git clone https://github.com/saifscripts/bike-rental-system.git
```

### 2. Change Directory

Next, navigate to the project directory with this command:

```
cd bike-rental-system
```

### 3. Install Dependencies

Before running the app, you need to install all dependencies. You can do this using either Yarn or npm.

#### Using Yarn

```
yarn install
```

#### Using npm

```
npm install --legacy-peer-deps
```

### 4. Add a .env File

To run the app, create a `.env` file in the root folder with the following properties (I have included a few demo values here for testing):

```
NODE_ENV=development
PORT=5000
DB_URI=mongodb://localhost:27017/bike-rental
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=demo_secret
JWT_ACCESS_EXP_IN=7d
```

**Note:** Change the `DATABASE_URL` if you want to use your own database URI.

### 5. Run the App

Now, you're ready to run the app. Use one of the following commands to start the server.

#### Using Yarn

```
yarn dev
```

#### Using npm

```
npm run dev
```

That's it! The application should now be running locally.
