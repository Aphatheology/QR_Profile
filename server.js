const express = require("express");
const startDb = require('./src/config/db.config')

const cors = require('cors');
const helmet = require("helmet");

const profileRouter = require('./src/routes/profile.route');
const { corsOptions } = require('./src/middleware/cors.middleware');
const { limiter } = require('./src/middleware/limiter.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

startDb();

// Protected by CORS, limited by Limter
app.use('/profile', cors(corsOptions), helmet(), limiter, profileRouter);

// Not protected by CORS, and request not limited
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
