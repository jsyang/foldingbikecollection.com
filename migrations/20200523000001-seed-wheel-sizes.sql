-- https://www.sheldonbrown.com/tire-sizing.html#iso
-- bsd = Bead Seat Diameter (mm)

create table if not exists "wheel_sizes_bsd"
(
    bsd integer primary key
);


-- $$('table[id="foo"] tr td:nth-child(1)').map(td=>td.innerText).filter(s=>/mm$/.test(s)).map(s=>'('+parseInt(s)+'),').join('')
insert into wheel_sizes_bsd
values (787),
       (686),
       (635),
       (630),
       (622),
       (609),
       (599),
       (597),
       (590),
       (584),
       (583),
       (571),
       (559),
       (547),
       (541),
       (540),
       (520),
       (507),
       (501),
       (490),
       (489),
       (484),
       (457),
       (451),
       (440),
       (438),
       (428),
       (419),
       (406),
       (400),
       (390),
       (369),
       (355),
       (349),
       (340),
       (337),
       (317),
       (305),
       (288),
       (254),
       (203),
       (335),
       (152),
       (137);

create table if not exists "wheel_sizes_applications"
(
    bsd integer,
    text text,
    foreign key (bsd) references wheel_sizes_bsd (bsd)
);


-- $$('table[id="1"] tr:not(:first-child)').map((tr,i,a)=>{
--     if(tr.children.length==2) {
--         return `(${parseInt(a[i-1].children[1].innerText) || parseInt(a[i-1].children[0].innerText)},'${tr.children[1].innerText}'),`
--     } else {
--         return `(${parseInt(tr.children[1].innerText)},'${tr.children[2].innerText}'),`
--     }
-- }).join('\n')
insert into wheel_sizes_applications (bsd, text)
values (787, 'Unicycles, some novelty bicycles'),
       (686, 'Unicycles, some novelty bicycles'),
       (622, 'This is a marketing term for wide 622 mm ("700C") tires.'),
       (635, 'English, Dutch, Chinese, Indian Rod-brake roadsters (Also marked F10, F25, 700 B)'),
       (622, '(F.13) Rare Canadian designation'),
       (622, 'Northern European designation for the 622 mm (700 C) size'),
       (630, 'Older road bikes.'),
       (609, 'Rare Danish size'),
       (571, 'Triathlon, time trial, small road bikes. Old Schwinn S-4'),
       (599, 'Very old U.S. lightweights'),
       (597, 'Older British sport & club bikes'),
       (597, 'Schwinn "lightweights"'),
       (590, 'Most English 3-speeds, department-store or juvenile 10 speeds'),
       (590, 'French version of 26 x 1 3/8; Italian high-performance bikes for smaller riders'),
       (584, 'French utility, tandem and loaded-touring bikes, a very few Raleigh (U.S.) & Schwinn mountain bikes.'),
       (583,
        'Oddball size formerly used on some GT models. 650B tire (584 mm) is close enough, maybe with wide rim tape.'),
       (571, 'Schwinn cruisers'),
       (571, 'High performance wheels for smaller riders, common on Cannondale bicycles'),
       (571, 'Triathlon, time trial, high performance road bikes for smaller riders'),
       (520, 'High performance wheels for smaller riders; Terry front'),
       (520, 'Caveat emptor'),
       (547, 'British or Schwinn Juvenile'),
       (547, 'Schwinn Juvenile lightweights'),
       (540, 'British Juvenile, most wheelchairs; common on women''s utility bicycles in Japan.'),
       (490, 'European Juvenile road bikes'),
       (451, 'Juvenile lightweights, BMX for light riders, some recumbents, some folding bicycles'),
       (457, 'Juvenile'),
       (419, 'Schwinn juvenile'),
       (440, 'European Juvenile, folding'),
       (406, 'Most BMX, juvenile, folders, trailers, some recumbents'),
       (400, 'British juvenile'),
       (390, 'European Juvenile'),
       (340, 'European Juvenile'),
       (369, 'Alex Moulton AM series'),
       (349, 'Older Moulton; Brompton & other folders, recumbent front, juvenile'),
       (337, 'Mystery tire'),
       (355, 'Birdy folding bikes'),
       (355, 'Juvenile'),
       (254, 'Juvenile'),
       (335, 'Polish juvenile'),
       (305, 'Juvenile, folders, trailers, some recumbents'),
       (317, 'Schwinn Juvenile'),
       (203, 'Juvenile, scooters'),
       (152, 'Wheelchair caster'),
       (137, 'Wheelchair caster')
;


-- Ensure migration is successfully logged
insert into "migrated" (name)
values ('20200523000001-seed-wheel-sizes.sql');
