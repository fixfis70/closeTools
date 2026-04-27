create table workers
(
    dni       int primary key,
    names     varchar(100) not null,
    role      varchar(30),
    work_area varchar(30),
    shift     bit
);

CREATE TABLE credentials
(
    id_user       INT PRIMARY KEY AUTO_INCREMENT,
    user          VARCHAR(50) UNIQUE NOT NULL,
    pass          VARCHAR(50)        NOT NULL,
    enable        BIT,
    creation_date DATE,
    id_worker     int,
    constraint fk_dni_id foreign key (id_worker) references workers (dni)
);

CREATE TABLE roles
(
    id_roles INT PRIMARY KEY AUTO_INCREMENT,
    role     VARCHAR(50)
);

CREATE TABLE asigned_roles
(
    user_id  INT,
    roles_id INT,
    primary key (user_id, roles_id),
    CONSTRAINT fk_id_user FOREIGN KEY (user_id) REFERENCES credentials (id_user),
    CONSTRAINT fk_roles_id FOREIGN KEY (roles_id) REFERENCES roles (id_roles)
);

create table loans
(
    id_loan int primary key auto_increment,
    loanTo  int,
    loanBy  int,
    reason  bit,
    foreign key (loanBy) references credentials (id_user),
    foreign key (loanTo) references workers (dni)
);

create table brands
(
    id_brand int primary key auto_increment,
    brand    varchar(40)
);

create table provider
(
    id_provider int primary key auto_increment,
    provaider    varchar(50),
    addres       varchar(100)
);

create table storages
(
    id_storage int primary key auto_increment,
    addres     varchar(100)
);

create table models
(
    id_model     int primary key auto_increment,
    model        varchar(60),
    kind_of_tool varchar(50),
    id_brand     int,
    constraint fk_id_brand foreign key (id_brand) references brands (id_brand)
);

create table receipts
(
    id_receipt int primary key auto_increment,
    receipt_img_url varchar(255),
    id_provider int,
    foreign key (id_provider) references provider (id_provider)
);

create table locker
(
    id_locker int primary key auto_increment,
    locker varchar(50),
    id_storage int,
    foreign key (id_storage) references storages (id_storage)
);

create table tools
(
    id_tool      int primary key auto_increment,
    serial          varchar(50),
    inv_code        varchar(50),
    state           varchar(30),
    oos_reason      varchar(50),
    purchase_cost   decimal(10, 2),
    purchase_date   date,
    oss_responsable int,
    id_model        int,
    id_receipt      int,
    id_storage      int,
    constraint fk_oss_responsable foreign key (oss_responsable) references credentials (id_user),
    constraint fk_id_model foreign key (id_model) references models (id_model),
    constraint fk_id_storage foreign key (id_storage) references storages (id_storage),
    foreign key (id_receipt) references receipts (id_receipt)
);

create table tools_loans
(
    id_tool int,
    id_loan int,
    start_tool_state datetime,
    end_tool_state datetime,
    loan_start datetime,
    loan_end datetime,
    primary key (id_tool,id_loan),
    foreign key (id_tool) references tools (id_tool),
    foreign key (id_loan) references loans (id_loan)
);


