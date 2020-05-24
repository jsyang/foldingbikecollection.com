create index index_bikes_query on bikes (name, brand);
create index index_bike_aliases_query on bike_aliases (name, bike);

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200524000002-add-indices.sql');
