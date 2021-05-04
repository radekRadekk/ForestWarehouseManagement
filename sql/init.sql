CREATE TABLE IF NOT EXISTS roles
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(50)           NOT NULL,
    code          VARCHAR(20) UNIQUE    NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS users
(
    id            INT GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(50)        NOT NULL,
    surname       VARCHAR(50)        NOT NULL,
    login         VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(64)        NOT NULL,
    role_id       INT                NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
            REFERENCES roles (id)
            ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS storage_units
(
    id          INT GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(100),

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products
(
    id              INT GENERATED ALWAYS AS IDENTITY,
    name            VARCHAR(50) UNIQUE NOT NULL,
    description     VARCHAR(100),
    storage_unit_id INT                NOT NULL,
    price           MONEY              NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_storage_unit
        FOREIGN KEY (storage_unit_id)
            REFERENCES storage_units (id)
            ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS warehouse_resources
(
    id                 INT GENERATED ALWAYS AS IDENTITY,
    product_id         INT UNIQUE NOT NULL,
    total_quantity     INT 		  NOT NULL,
    available_quantity INT 		  NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
            REFERENCES products (id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders
(
    id           INT GENERATED ALWAYS AS IDENTITY,
    client_name  VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15)  NOT NULL,
    employee_id  INT          NOT NULL,
    date         TIMESTAMP    NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    CONSTRAINT fk_employee_id
        FOREIGN KEY (employee_id)
            REFERENCES users (id)
            ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS addresses
(
    id              INT GENERATED ALWAYS AS IDENTITY,
    street          VARCHAR(50),
    building_number VARCHAR(8),
    town            VARCHAR(50) NOT NULL,
    postcode        VARCHAR(6)  NOT NULL,
    order_id        INT         NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_order_id
        FOREIGN KEY (order_id)
            REFERENCES orders (id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_positions
(
    id         INT GENERATED ALWAYS AS IDENTITY,
    product_id INT NOT NULL,
    quantity   INT NOT NULL,
    order_id   INT NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_product_id
        FOREIGN KEY (product_id)
            REFERENCES products (id)
            ON DELETE NO ACTION,
    CONSTRAINT fk_order_id
        FOREIGN KEY (order_id)
            REFERENCES products (id)
            ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS receipts
(
    id          INT GENERATED ALWAYS AS IDENTITY,
    order_id    INT       NOT NULL,
    employee_id INT       NOT NULL,
    date        TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    CONSTRAINT fk_order_id
        FOREIGN KEY (order_id)
            REFERENCES orders (id)
            ON DELETE NO ACTION,
    CONSTRAINT fk_employee_id
        FOREIGN KEY (employee_id)
            REFERENCES users (id)
            ON DELETE NO ACTION
);

INSERT INTO roles(name, code) VALUES('admin', 'admin_employee');
INSERT INTO roles(name, code) VALUES('pracownik biura', 'office_employee');
INSERT INTO roles(name, code) VALUES('pracownik magazynu', 'warehouse_employee');