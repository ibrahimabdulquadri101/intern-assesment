📧 ESP Integration API Documentation
This document describes the setup, configuration, and available endpoints for the ESP Integration API, a RESTful service built using Node.js and Express.js. The primary objective of this API is to allow users to securely integrate their accounts with external Email Service Providers (ESPs), specifically Mailchimp and GetResponse, to manage and retrieve audience list data.

🚀 Getting Started
To run this project locally, you must first ensure you meet the necessary prerequisites and follow the setup instructions carefully.

Prerequisites and Setup
Before starting the server, the following software must be installed on your system: Node.js (v18 or higher), npm (Node Package Manager), and access to a MongoDB instance (either local or cloud-hosted).

Clone the Repository: Begin by cloning the project source code from its repository and navigating into the new directory.

Install Dependencies: Run npm install to download all required project dependencies.

Environment Configuration: A crucial step is configuring the environment variables for security and connectivity. You must create a file named .env.production.local in the root directory. This file requires several keys:

PORT: The port on which the server will listen (e.g., 3000).

DB_URI: The full connection string for your MongoDB database.

JWT_SECRET: A secure, secret string used for signing user authentication tokens.

JWT_EXPIRES_IN: Defines the lifespan of the generated JWT tokens (e.g., 7d).

CRYPTO_SECRET: A 64-character hexadecimal key essential for the secure encryption and decryption of sensitive API credentials before they are stored in the database.

Running the Server: Once configured, execute npm start. The API will then be operational and accessible at http://localhost:[PORT].

📌 API Endpoints Overview
All primary API functionalities are routed under the /api/v1 prefix. The endpoints are categorized into public Authentication routes and secure Integrations routes.

Authentication Endpoints (Public)
These endpoints handle user account creation and login, and do not require a prior security token.

Sign Up (POST /api/v1/auth/sign-up): Creates a new user account. It expects an email and password in the request body.

Sign In (POST /api/v1/auth/sign-in): Authenticates a user using their email and password, and returns a JSON Web Token (JWT) upon successful verification.

Integrations Endpoints (Secure)
These endpoints are protected and require the JWT obtained from the Sign In route to be passed in the Authorization header as a Bearer <token>.

Save and Validate Credentials (POST /api/v1/integration/esp): This route is used to submit an API key for either Mailchimp or GetResponse. The API attempts to verify the key against the respective ESP platform. If verification is successful, the API key is encrypted and saved to the database, along with the provider name (mailchimp or getresponse). It requires the provider and apiKey fields in the request body.

Fetch Lists (GET /api/v1/integration/esp/lists): Retrieves all normalized audience lists (campaigns or audiences) associated with the user's connected and verified ESP account. This endpoint requires a URL query parameter ?provider= set to either mailchimp or getresponse to specify the target ESP.

🗄️ Database Schema
The application uses MongoDB and Mongoose for data persistence, structuring data into two main collections:

users Collection: Stores all user authentication data. Fields include email (unique) and password (stored as a hash).

integrations Collection: Stores connection details for each ESP. Fields include:

userId: A reference string linking the integration to the specific user.

provider: A string indicating the ESP (mailchimp or getresponse).

apiKey: The AES-256 encrypted string of the sensitive API key.

isVerified: A boolean flag indicating whether the API key successfully passed the initial credential verification check.
