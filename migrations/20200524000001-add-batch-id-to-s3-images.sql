alter table "s3_images" add batch_id text;

create index index_s3_images_batch_id on s3_images (batch_id);

-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200524000001-add-batch-id-to-s3-images.sql');
