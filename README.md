# Power Pulse 2.0

![Web-site main page](./assets/img1.png)

Backend for the Sports and Nutrition Application.

This repository contains the backend part of the application that helps an
authorized user control their nutrition and activity.

## Project Structure

-   `/controllers`: Folder with controller files responsible for handling client
    requests.
-   `/helpers`: Folder with auxiliary functions used in other parts of the
    project.
-   `/middlewares`: Folder with middleware files used to process requests to the
    server on the way to the main request handler.
-   `/routes/api`: Folder with files containing the implementation of API
    routes. Here, URL paths and corresponding handlers responding to requests
    are defined.
-   `app.js`: File where an Express application is configured and created.
    Necessary modules are imported, middleware is configured, and routers are
    connected.
-   `server.js`: File for configuring the server itself. It involves connecting
    to the database and setting up the Express server.

## Requirements and Dependencies

-   [Node.js](https://nodejs.org/en/) version v20.10.0.
-   npm for package management.

## Technologies

-   <p >
      <img width="100" alt='node.js' src="./assets/img6.png">
    </p>
-   <p >
      <img width="100" alt='express' src="./assets/img2.png">
    </p>
-   <p >
      <img width="100" alt='mongoDB' src="./assets/img3.png">
    </p>
-   <p >
      <img width="100" alt='cloudinary' src="./assets/img4.png">
    </p>
-   <p >
      <img width="100" alt='nodemailer' src="./assets/img5.png">
    </p>

## Running Instructions

-   Install dependencies: `npm install`.
-   Configure environment variables in the `.env` file using the example in
    `.env.example`.
-   Start the server: `npm run start`.

## Team

-   **Team-lead**
    -   [OlehKhv](https://github.com/OlehKhv)
-   **User Authentication Developer:**
    -   [alyonapolova](https://github.com/alyonapolova)
-   **User Dairy Developer:**
    -   [nicksolony](https://github.com/nicksolony)

## Useful Links

-   [Project API Documentation](https://power-4vwy.onrender.com/api/v1/api-docs/):
    Explore the documentation for information on available routes, parameters,
    and example calls.
-   [GitHub Repository - Frontend](https://github.com/SaltyUA/power-pulse-fs):
    Check out the source code of the Frontend part of the project, where you'll
    find the web interface and corresponding client-side code.
