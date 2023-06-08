require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')

// Extra Security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// error handler
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const auth = require('./middleware/authentication');

// extra packages
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/jobs', auth, jobRouter)
app.use('/api/v1/auth', authRouter)

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
        //Connect DB
        console.log(`Server is listening on port ${port}...`)
      }
    );
  } catch (error) {
    console.log(error);
  }
};

start();
