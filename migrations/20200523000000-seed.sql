create table if not exists "migrated"
(
    name TEXT PRIMARY KEY
);

-- Ensure migration is successfully logged
insert into "migrated" (name) values ('20200523000000-seed.sql');
