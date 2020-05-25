alter table s3_images
    rename to s3_files;

alter table s3_files
    add type text null default 'image';

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200525000000-rename-s3-images-to-s3-file.sql');
