const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./db/connection');
const authRouter = require('./routes/auth');
const contactsRouter = require('./routes/contacts');
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Ana sayfa için karşılama mesajı
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to Contacts API!",
    documentation: {
      auth: {
        register: {
          method: "POST",
          url: "/auth/register",
          body: {
            name: "string (required)",
            email: "string (required)",
            password: "string (required)"
          }
        },
        login: {
          method: "POST",
          url: "/auth/login",
          body: {
            email: "string (required)",
            password: "string (required)"
          }
        },
        refresh: {
          method: "POST",
          url: "/auth/refresh",
          headers: {
            "Authorization": "Bearer <access_token>"
          }
        },
        logout: {
          method: "POST",
          url: "/auth/logout",
          headers: {
            "Authorization": "Bearer <access_token>"
          }
        }
      },
      contacts: {
        getAllContacts: {
          method: "GET",
          url: "/contacts",
          headers: {
            "Authorization": "Bearer <access_token>"
          },
          query: {
            page: "number (default: 1)",
            perPage: "number (default: 10)",
            sortBy: "string (default: name)",
            sortOrder: "string (asc/desc)",
            type: "string (optional)",
            isFavourite: "boolean (optional)"
          }
        },
        getContactById: {
          method: "GET",
          url: "/contacts/:id",
          headers: {
            "Authorization": "Bearer <access_token>"
          }
        },
        createContact: {
          method: "POST",
          url: "/contacts",
          headers: {
            "Authorization": "Bearer <access_token>"
          },
          body: {
            name: "string (required)",
            phoneNumber: "string (required)",
            email: "string (optional)",
            isFavourite: "boolean (optional)",
            contactType: "string (required)"
          }
        },
        updateContact: {
          method: "PATCH",
          url: "/contacts/:id",
          headers: {
            "Authorization": "Bearer <access_token>"
          },
          body: {
            name: "string (optional)",
            phoneNumber: "string (optional)",
            email: "string (optional)",
            isFavourite: "boolean (optional)",
            contactType: "string (optional)"
          }
        },
        deleteContact: {
          method: "DELETE",
          url: "/contacts/:id",
          headers: {
            "Authorization": "Bearer <access_token>"
          }
        }
      }
    }
  });
});

app.use('/auth', authRouter);
app.use('/contacts', authenticate, contactsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Server başlatma hatası:', error);
    process.exit(1);
  }
};

start();
