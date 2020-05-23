create table if not exists "brands"
(
    id   integer primary key autoincrement,
    name text
);

insert into brands (id, name)
values (1, 'Dahon'),
       (2, 'Brompton'),
       (3, 'Tern'),
       (4, 'Bike Friday'),
       (5, 'Pacific Cycles'),
       (6, 'Fnhon'),
       (7, 'Bickerton'),
       (8, 'Moulton'),
       (9, 'Raleigh'),
       (10, 'Dawes'),
       (11, 'Bigfish'),
       (12, 'Montague'),
       (13, 'DiBlasi');

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200523000002-seed-brands.sql');
