--Users:
create table users (
	username text not null,
	password_hash text not null,
	User_id int auto_increment,
	primary key(user_id)
);
-- Posts:
create table posts (
	post_id int auto_increment,
	user_id int, 
	author text,
	content text,
	post_date timestamp,
	like_count int,
	primary key(post_id, user_id)
);
--Replies (optional):
create table likes (
	like_id int auto_increment,
	user_id int,
	post_id int,
	primary key (like_id)
)
