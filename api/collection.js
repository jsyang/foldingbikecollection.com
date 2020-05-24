const bodyParser       = require('body-parser');
const {PAGE_SIZE = 30} = process.env;

module.exports = (app, db) => {

    app.post('/api/collection/query', bodyParser.json(), (req, res) => {
        const {page = 0, term} = req.body;

        let resultBikes       = [];
        let resultBikeAliases = [];
        let resultBrands      = [];
        let foundIds          = [];

        const pageClause = `limit ${PAGE_SIZE} offset ${page * PAGE_SIZE}`;

        if (term) {
            resultBikes       = db.main.prepare(`select id from bikes where name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();
            resultBikeAliases = db.main.prepare(`select bike from bike_aliases where name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();
            resultBrands      = db.main.prepare(`select b.id from bikes b inner join brands br on br.id = b.brand where br.name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();

            foundIds = Array.from(new Set(
                resultBikeAliases
                    .concat(resultBikes)
                    .concat(resultBrands)
            ));

            if (foundIds.length === 0) {
                res.json([]);
            }
        }

        let query = 'select * from bikes ';

        if (foundIds.length > 0) {
            query += `where id in (${foundIds.join(',')}) `;
        }

        query += pageClause;

        const bikes = db.main.prepare(query).all();

        res.json(bikes.map(b => {
            const wheel_sizes = db.main.prepare(`
            select s.wheel_size, sa.name
                from bike_wheel_sizes s
                inner join wheel_size_aliases sa on sa.bsd = s.wheel_size
            where s.bike = ${b.id}`
            ).all();

            const aliases = db.main.prepare(`select name from bike_aliases where bike = ${b.id}`).pluck().all();

            return {
                ...b,
                wheel_sizes,
                aliases
            };
        }));
    });
};
