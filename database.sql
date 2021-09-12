CREATE DATABASE todo_database;

CREATE TABLE lists(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE list(
    id SERIAL PRIMARY KEY,
    list_id INT,
    name VARCHAR(255)
);
