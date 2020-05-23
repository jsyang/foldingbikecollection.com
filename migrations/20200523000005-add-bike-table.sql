create table if not exists "bikes"
(
    id    integer primary key autoincrement,
    name  text,
    brand integer,
    foreign key (brand) references brands (id)
);

insert into bikes (id, name, brand)
values (1, 'Brompton S1E', 2),
       (2, 'Moulton F-frame mk. 2', 8),
       (3, 'Dahon PrestoLite', 1)
;

-- Store wheel size relationships separately since each bike may come in more than one wheel size on the same frame
-- e.g. Raleigh Chopper
create table if not exists "bike_wheel_sizes"
(
    id         integer primary key autoincrement,
    bike       integer,
    wheel_size integer,
    foreign key (bike) references bikes (id),
    foreign key (wheel_size) references wheel_sizes_bsd (bsd)
);

insert into bike_wheel_sizes (bike, wheel_size)
values (1, 349),
       (2, 349),
       (3, 305)
;

-- Store aliases, since bike names are usually marketing products, they may refer to the same product under different names
-- e.g. Brompton M3L is also the Brompton B75
create table if not exists "bike_aliases"
(
    id   integer primary key autoincrement,
    bike integer,
    name text,
    foreign key (bike) references bikes (id)
);

insert into bike_aliases (bike, name)
values (1, 'Brompton S1R'),
       (1, 'Brompton S1L')
;

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200523000005-add-bike-table.sql');
