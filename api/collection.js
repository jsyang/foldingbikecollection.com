const bodyParser       = require('body-parser');
const {PAGE_SIZE = 30} = process.env;

module.exports = (app, db) => {

    app.post('/api/collection/query', bodyParser.json(), (req, res) => {
        const {page = 0, term, brands, wheel_size_aliases} = req.body;

        let resultBikes       = [];
        let resultBikeAliases = [];
        let resultBrands      = [];
        let foundIds          = [];

        const pageClause = `limit ${PAGE_SIZE} offset ${page * PAGE_SIZE}`;

        let hasTermResults = false;

        // Find ids by term
        if (term) {
            resultBikes       = db.main.prepare(`select id from bikes where name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();
            resultBikeAliases = db.main.prepare(`select bike from bike_aliases where name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();
            resultBrands      = db.main.prepare(`select b.id from bikes b inner join brands br on br.id = b.brand where br.name like '%${term}%' COLLATE NOCASE ${pageClause}`).pluck().all();

            foundIds = Array.from(new Set(
                resultBikeAliases
                    .concat(resultBikes)
                    .concat(resultBrands)
            ));

            hasTermResults = foundIds.length > 0;

            // No results means we should do no more processing and quit now
            if (!hasTermResults) {
                res.json([]);
                return;
            }
        }

        let query = 'select * from bikes ';

        // Select only those found by term search
        if (hasTermResults) {
            query += `where id in (${foundIds.join(',')}) `;
        }

        // Filter by brand
        if (brands) {
            if (query.indexOf('where') >= 0) {
                query += 'and ';
            }

            query += `where brand in (${brands.join(',')}) `
        }

        query += pageClause;

        let bikes = db.main.prepare(query).all();

        // Filter by wheel_size_alias
        if (wheel_size_aliases) {
            const matchMandatoryWheelSizes = new Set(db.main.prepare(`
            select s.bike
                from bike_wheel_sizes s
                inner join wheel_size_aliases sa on sa.bsd = s.wheel_size
            where sa.id in (${wheel_size_aliases.join(',')})`
            ).pluck().all().map(Number));

            bikes = bikes.filter(b => matchMandatoryWheelSizes.has(b.id));
        }

        // Add all relevant subfields
        const finalObject = bikes.map(b => {
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
        });

        res.json(finalObject);
    });
};
