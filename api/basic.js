module.exports = (app, db) => {
    app.get('/api/brands', (req, res) => res.json(db.main.prepare('select * from brands').all()));
    app.get('/api/wheel_size_aliases', (req, res) => res.json(db.main.prepare('select * from wheel_size_aliases').all()));
};
