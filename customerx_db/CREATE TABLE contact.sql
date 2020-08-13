CREATE TABLE contact (
	id int primary key auto_increment,
    name varchar(60) not null,
    email varchar(60) not null,
    phone varchar(11) not null,
    id_client int,
    foreign key (id_client) references client(id)
);