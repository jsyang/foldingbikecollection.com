const express = require('express');
const sqliteDB = require('better-sqlite3');

const app     = express();
const db       = {
    main: new sqliteDB('main.db', {verbose: console.log})
};

app.get('/', () => {
    console.log('todo: dump DB table to JSON here');
});

app.listen(process.env.PORT || 3000);

