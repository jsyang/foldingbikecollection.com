const {uuid} = require('uuidv4');

module.exports = (app, db) => {
    app.get('/api/uuid/generate', (req, res) => res.json({uuidv4: uuid()}));
    app.get('/api/brands', (req, res) => res.json(db.main.prepare('select * from brands').all()));
    app.get('/api/wheel_size_aliases', (req, res) => res.json(db.main.prepare('select * from wheel_size_aliases').all()));
};
