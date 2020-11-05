create table products (
	id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  price integer
)

create table stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id")
)

insert into products (title, description, price) values 
('Hugo Boss Hugo Urban Journey', 'Description', 40),
('Tom Ford Lost Cherry 100ml LUXE', 'Description', 44),
('Tom Ford Neroli Portofino 100ml LUXE', 'Description', 300),
('Tom Ford Lost Cherry 50ml LUXE', 'Description', 250),
('Kenzo LEau Par Kenzo Pour Femme', 'Description', 47),
('Franck Boclet Cocaine', 'Description', 400),
('Creed Aventus 50ml LUXE', 'Description', 275),
('Creed Silver Mountain Water 100ml edp LUXE', 'Description', 310)
 
insert into stocks (product_id, count) values 
('11d6c262-8d41-4928-98c8-8fc536c1593c', 10),
('8f698d36-6afc-49dc-9190-e28dd1816f3e', 8),
('6955d6ff-f100-450b-afb1-5901bbc1bebd', 12),
('ed360e7d-7775-4028-aec6-00a556083add', 7),
('ce817322-485d-4f03-a42f-a07f0d60af05', 9),
('e018bd11-c6d1-4f45-a2c1-79b3bd913e94', 11),
('d9d33eaa-695b-4518-bd65-061e0eb19ff2', 15),
('4795031e-b761-47d7-93e4-748f875da30f', 5)

create extension if not exists "uuid-ossp";