# **Contact Management APIs**

## **Efficient Contact Storage and Retrieval System**

This project provides a robust backend API built with **Node.js**, **Express.js**, and **MongoDB**. It allows for efficient management of contact information, including features for creating, reading, updating, and deleting contacts.

## Overview
This API allows users to manage contacts and user authentication, including registration, login, and user account management.


## Base URL
http://localhost:5000/api

## User Endpoints

- **Register User:** `POST /api/users/register`
- **Login User:** `POST /api/users/login`
- **Logout User:** `POST /api/users/logout`
- **Get Current User:** `GET /api/users/current`
- **Update User:** `PUT /api/users/update`
- **Delete User:** `DELETE /api/users/delete`

## Contact Endpoints

- **Get All Contacts:** `GET /api/contacts`
- **Create Contact:** `POST /api/contacts`
- **Get Contact by ID:** `GET /api/contacts/:id`
- **Update Contact:** `PUT /api/contacts/:id`
- **Delete Contact:** `DELETE /api/contacts/:id`
- **Search Contacts:** `GET /api/contacts/search`
- **Get Contact Count:** `GET /api/contacts/count`
- **Bulk Delete Contacts:** `DELETE /api/contacts/bulk-delete`

## Testing with Swagger
Swagger has been installed for better user testing of APIs. Access the Swagger UI to interact with the API endpoints easily.

## Steps to Run the Code

### Clone the Repository
To clone the repository, run:
```bash
    git clone <repository-url>
    cd <repository-name>
```


### Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```
### Create the .env File
In the root of your project directory, create a file named .env and add the following content:

```plaintext
PORT=
MONGO_URL=
JWT_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
DOMAIN=http://localhost:5000
```

### Start the Server
Run the following command to start your server:
```bash
npm start
```

### Access the API
 The server should now be running on http://localhost:5000. You can use tools like Postman or Swagger to test the API endpoints.

### Open Swagger UI
 If you've integrated Swagger, navigate to http://localhost:5000/api-docs in your web browser to access the Swagger UI for testing.