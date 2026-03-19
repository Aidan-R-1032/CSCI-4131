-- tran1219@umn.edu collaborated for the sales table during In-Class Exercise on 11/27/23
create table sales(
    id int not null auto_increment,
    sale text not null,
    start_time datetime default CURRENT_TIMESTAMP,
    end_time datetime default null,
    primary key(id)
);

INSERT INTO sales(sale) value("Some sale");

UPDATE sales SET end_time = CURRENT_TIMESTAMP WHERE end_time IS NULL;


SELECT * FROM sales ORDER BY start_time DESC LIMIT 3;

create table contacts(
    id int not null auto_increment,
    contact_name text not null,
    email text not null,
    meeting datetime not null,
    meeting_type text not null,
    subscribe text not null,
    primary key(id)
)