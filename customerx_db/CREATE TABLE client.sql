CREATE TABLE client (
	id int primary key auto_increment,
    name varchar(60) not null,
    email varchar(60),
    phone varchar(11) not null,
    register_date date not null
);