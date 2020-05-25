create table if not exists "contentsets"
(
    id         integer primary key autoincrement,
    name       text,
    created_at text
);

create table if not exists "contentset_s3_files"
(
    contentset integer,
    s3_file    integer,
    foreign key (contentset) references contentsets (id),
    foreign key (s3_file) references s3_files (id),
    primary key (contentset, s3_file)
);

create table if not exists "contentset_bikes"
(
    contentset integer,
    bike       integer,
    foreign key (contentset) references contentsets (id),
    foreign key (bike) references bikes (id),
    primary key (contentset, bike)
);

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200525000001-add-contentset.sql');
