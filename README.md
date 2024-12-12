# Banking System

This project is a Banking System built using a combination of Node.js for the backend, React.js for the Admin and SWIFT. The system enables the management of customers, dependents, and OTP-based security features. It includes APIs for creating, updating, and managing customer data as well as interactive frontend interfaces for user interaction.

## Features

## Backend Features

# Customer Management:

 * Create, update, and deactivate customer records.

 * Manage customer dependents.

 * Secure endpoints with token-based authentication.

# OTP (One-Time Password):

 * Generate and validate OTPs.

 * OTPs are valid for a specified duration (e.g., 5 minutes).

# Pagination:

* Support for paginated customer lists with search functionality.

# Database Management:

* Using a MySQL database to store customer and OTP data.

## Frontend Features

# Customer List:

* View a paginated and searchable list of customers.

* Includes options to edit, deactivate, or manage dependents for each customer.

# Add Customer Modal:

* Modal-based interface for adding new customers.

# Actions and Feedback:

* Buttons for requesting OTP, editing customers, and managing dependents.

* Visual feedback using button hover effects and status indicators.

## Technologies Used

# Backend

* Node.js with Express.js: Backend framework for handling HTTP requests and API endpoints.

* MySQL: Relational database for storing customer and OTP data.

* JWT (JSON Web Tokens): Token-based authentication for secure API access.

# Frontend

* React.js: Frontend framework for building dynamic user interfaces.

* Tailwind CSS: Utility-first CSS framework for styling.

# Installation and Setup

## Prerequisites

* Node.js (v20+)

* MySQL Server

# Backend Setup

## 1. Clone the repository:

``` bash 
git clone https://github.com/your-repo/banking-system.git
cd banking-system/backend
```
## 2. Install dependencies:
``` bash 
npm install
```
## 3. Configure the database:

 * Create a MySQL database.

* Import the provided schema.sql file to set up tables.

* Update database credentials in the .env file:
``` bash
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
```

## 4. Start the server:
``` bash
yarn start
```
The server will run at http://localhost:3000.

# Frontend Setup

## 1. open another terminal and Navigate to the admin directory:
``` bash
cd ../frontend
```
## 2. Install dependencies:
``` bash
yarn install
```
## 3. Start the development server:
``` bash
npm dev
or 
yarn dev
```
The frontend will be accessible at http://localhost:3001.

# Frontend Highlights

## Components

 * CustomerList: Displays the paginated list of all customers with actions.

* AddCustomerModal: Handles adding new customers via a modal form.

 * Button: Reusable button component with variants for secondary, destructive, etc.

# Styling

* Leveraged Tailwind CSS for rapid UI development.

* Clean and responsive design suitable for different screen sizes.

# How to Use

1. Run both backend and frontend servers.

2. Sign up then Login to the system (to get auth token).

3. Use the customer list to view, edit, or deactivate customers.

4. Add new customers using the Add Customer button.

5. Generate OTPs for customer to allow him to varify then login for secure operations.

6. Manage customer dependents as required.

# Future Enhancements

* Implement role-based access control for different user types.

* Add email or SMS integration for sending OTPs.

* Enhance error handling and validation.

* Improve UI design with animations and enhanced feedback.

# Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss the proposed changes.