create table if not exists "s3_images"
(
    id         integer primary key autoincrement,
    location   text,
    created_at text

);

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200524000000-add-s3-images.sql');
