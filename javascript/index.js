'use strict';
const path = require('path');
const dotenv = require('dotenv');
const server = require('./src/server');

dotenv.config({ path: path.join(__dirname, "src/config", ".env") });

server.listen(process.env.PORT, () => {
    console.log(`Server :: http://localhost:${process.env.PORT}`);
});