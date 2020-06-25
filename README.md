# foldingbikecollection.com
Code to generate pages of the foldingbikecollection.com site

- Steal blurbs for Why here:
    - https://justyna.typepad.com/bike_chicago/folding_bikes/

### Helpful notes
- [sql.js for in-browser read-only queries to reduce load](https://github.com/sql-js/sql.js)
- [SQLite for web apps](https://stackoverflow.com/a/62220/7216921)
    - USE TRANSACTIONS FOR WRITES
    - Queue transactions up
    - Then flush them periodically (COMMIT)
    - Use [write ahead logging (WAL)](https://www.sqlite.org/wal.html) with statement `PRAGMA journal_mode=WAL;`

#### `better-sqlite3`
- [better-sqlite3 help notes](https://github.com/JoshuaWise/better-sqlite3/issues/125)
- [api reference](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md)

## Setting up for `yarn viz`
- SchemaSpy download: https://github.com/schemaspy/schemaspy/releases
- SQLite JDBC driver: https://bitbucket.org/xerial/sqlite-jdbc/downloads
