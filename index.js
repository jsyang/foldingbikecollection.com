const express  = require('express');
const sqliteDB = require('better-sqlite3');

const db = {
    main: new sqliteDB('main.db', {verbose: console.log})
};

const app = express();

app.use(express.static('public'));

app.listen(process.env.PORT || 3000);

