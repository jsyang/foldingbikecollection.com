const fs       = require('fs');
const sqliteDB = require('better-sqlite3');

const db = {
    main: new sqliteDB('main.db', {verbose: console.log})
};

const hasFirstMigrationBeenRun =
          db.main.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='migrated';`)
              .pluck()
              .get() === 'migrated';

const alreadyMigrated = hasFirstMigrationBeenRun?
    db.main.prepare('select * from migrated;').all().map(migration => migration.name) : [];

fs.readdirSync('migrations')
    .sort()
    .forEach(f => {
        if (alreadyMigrated.indexOf(f) >= 0) {
            console.log(`Skipping "${f}"`);
        } else {
            db.main.exec(fs.readFileSync(`migrations/${f}`).toString());
            console.log(`Applied "${f}"`);
        }
    });
