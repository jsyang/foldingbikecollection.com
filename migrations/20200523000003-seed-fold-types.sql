create table if not exists "fold_types"
(
    id integer primary key autoincrement,
    name text
);

insert into fold_types (name)
values ('front fork'),
       ('front frame'),
       ('rear fork'),
       ('rear frame'),
       ('stem'),
       ('handlebars'),
       ('seat post'),
       ('wheel');

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200523000003-seed-fold-types.sql');
