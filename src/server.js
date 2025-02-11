const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./db/connection');
const path = require('path');
const fs = require('fs').promises;

dotenv.config();
const app = express();

// Controllers
const authController = require('./controllers/authController');
const contactsController = require('./controllers/contactsController');

const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

// Temp directory
const tempDir = path.join(__dirname, 'temp');
fs.mkdir(tempDir, { recursive: true })
  .then(() => console.log('Temp directory created successfully'))
  .catch(console.error);

// Middlewares
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Ana sayfa - API Dokümantasyonu
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contacts API Documentation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #333;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
            }
            h2 {
                color: #666;
                margin-top: 30px;
            }
            code {
                background: #f4f4f4;
                padding: 2px 5px;
                border-radius: 3px;
            }
            .endpoint {
                background: #f8f8f8;
                padding: 15px;
                margin: 10px 0;
                border-left: 4px solid #333;
            }
        </style>
    </head>
    <body>
        <h1>📞 Contacts API Documentation</h1>
        
        <h2>🔐 Authentication Endpoints</h2>
        
        <div class="endpoint">
            <h3>Register User</h3>
            <code>POST /auth/register</code>
            <p>Create a new user account.</p>
            <p>Body: { "name": "string", "email": "string", "password": "string" }</p>
        </div>

        <div class="endpoint">
            <h3>Login</h3>
            <code>POST /auth/login</code>
            <p>Login with existing credentials.</p>
            <p>Body: { "email": "string", "password": "string" }</p>
        </div>

        <div class="endpoint">
            <h3>Logout</h3>
            <code>POST /auth/logout</code>
            <p>Logout current user.</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <h2>📱 Contacts Endpoints</h2>

        <div class="endpoint">
            <h3>Get All Contacts</h3>
            <code>GET /contacts</code>
            <p>Get all contacts for authenticated user.</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <div class="endpoint">
            <h3>Get Contact by ID</h3>
            <code>GET /contacts/:id</code>
            <p>Get a specific contact by ID.</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <div class="endpoint">
            <h3>Create Contact</h3>
            <code>POST /contacts</code>
            <p>Create a new contact.</p>
            <p>Body: { "name": "string", "email": "string", "phoneNumber": "string" }</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <div class="endpoint">
            <h3>Update Contact</h3>
            <code>PATCH /contacts/:id</code>
            <p>Update an existing contact.</p>
            <p>Body: { "name?": "string", "email?": "string", "phoneNumber?": "string" }</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <div class="endpoint">
            <h3>Delete Contact</h3>
            <code>DELETE /contacts/:id</code>
            <p>Delete a contact.</p>
            <p>Requires: Authorization Bearer Token</p>
        </div>

        <footer style="margin-top: 50px; text-align: center; color: #666;">
            <p>API Version: 1.0.0 | Created by Gülay Düzgün</p>
        </footer>
    </body>
    </html>
  `);
});

app.use('/auth', authController);
app.use('/contacts', authenticate, contactsController);
app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server ${process.env.PORT || 3000} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Server başlatma hatası:', error);
    process.exit(1);
  }
};

start();
