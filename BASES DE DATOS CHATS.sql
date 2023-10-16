Drop table if exists chats;
create table chats (
	id_chat int primary key AUTO_INCREMENT,
    nombre varchar(50)
);
Drop table if exists mensajes;
create table mensajes(
	id_chat int,
    id_mensaje int primary key AUTO_INCREMENT,
    ID_contact int,
    mensaje varchar(200),
    fecha datetime,
    FOREIGN KEY (ID_contact) references Contactos(ID_contact),
    FOREIGN KEY (id_chat) REFERENCES chats(id_chat)
);
Drop table if exists usuarios_chats;
create table usuarios_chats(
	id_userchat int primary key AUTO_INCREMENT,
	id_chat int,
    ID_contact int,
    FOREIGN KEY (ID_contact) references Contactos(ID_contact),
    FOREIGN KEY (id_chat) REFERENCES chats(id_chat)
);
Drop table if exists Contactos;
create table Contactos(
	ID_contact int primary key AUTO_INCREMENT,
    user varchar(50),
    password varchar(50)
);
INSERT INTO Contactos  (user,password)
Values
('faustoide', 'pepe'),
('nbasile', 'grego'),
('richard', 'momo'), 
('cirito', 'george')
;

INSERT INTO usuarios_chats (id_chat, ID_contact)
Values (1, 1);
INSERT INTO usuarios_chats (id_chat, ID_contact)
Values (1, 2);
INSERT INTO usuarios_chats (id_chat, ID_contact)
Values (2, 2);
INSERT INTO usuarios_chats (id_chat, ID_contact)
Values (2, 3);

insert into mensajes (id_chat, ID_contact, mensaje, fecha)
Values (1, 2, "hola que tal", "2018-04-01")
;

select *
from usuarios_chats
;

Select *
From Contactos
;

select * 
From chats
;

select *
from mensajes
;

select * 
From chats
inner join usuarios_chats on usuarios_chats.id_chat = chats.id_chat
Where ID_contact = 1;
