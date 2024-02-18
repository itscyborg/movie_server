const express = require('express');
const app = express();

require('dotenv').config()

const port = process.env.PORT;
const cors = require('cors');

app.use(cors());


const routes = require('./Routes/telegramRoutes');

app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
