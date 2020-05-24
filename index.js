require('dotenv').config();

const express  = require('express');
const sqliteDB = require('better-sqlite3');

const {
          PORT   = 3000,
          ORIGIN = `http://localhost:${PORT}`,
      } = process.env;

const db = {
    main: new sqliteDB('main.db', {verbose: console.log})
};

const app = express();

// Public files
app.use(express.static('public'));

// SEO
app.get('/favicon.ico', (req, res) => res.end());
app.get('/robots.txt', (req, res) => res.end(`Sitemap: ${ORIGIN}/sitemap.txt`));
app.get('/sitemap.txt', (req, res) => {
    const bikes = db.main.prepare('select id from bikes').all();

    res.end([
        `${ORIGIN}/`,
        ...(bikes.map(b => `${ORIGIN}/bike/${b.id}`))
    ].join('\n'));
});

// API
require('./api/basic')(app, db);
require('./api/collection')(app, db);
require('./api/upload')(app);

app.listen(PORT);
