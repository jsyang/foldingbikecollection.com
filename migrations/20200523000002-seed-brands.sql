create table if not exists "brands"
(
    id integer primary key autoincrement,
    name text
);

insert into brands (name)
values ('Dahon'),
       ('Brompton'),
       ('Tern'),
       ('Bike Friday'),
       ('Pacific Cycles'),
       ('Fnhon'),
       ('Bickerton'),
       ('Moulton'),
       ('Raleigh'),
       ('Dawes'),
       ('Bigfish'),
       ('Montague'),
       ('DiBlasi');

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200523000002-seed-brands.sql');
