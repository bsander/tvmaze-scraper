CREATE ROLE tvmaze_app WITH LOGIN PASSWORD 'tvmaze';

CREATE DATABASE "tvmaze_content";

-- Switch to created database for further commands
\connect -reuse-previous=on "dbname='tvmaze_content'";

CREATE TABLE public."cast" (
    cast_id integer NOT NULL PRIMARY KEY,
    name varchar NOT NULL,
    birthday date
);

CREATE TABLE public.shows (
    show_id integer NOT NULL PRIMARY KEY,
    name varchar NOT NULL
);

CREATE TABLE public.show_cast (
    show_id integer NOT NULL REFERENCES public.shows (show_id) ON UPDATE CASCADE ON DELETE CASCADE,
    cast_id integer NOT NULL REFERENCES public."cast" (cast_id) ON UPDATE CASCADE ON DELETE CASCADE
);

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public."cast" TO tvmaze_app;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.show_cast TO tvmaze_app;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.shows TO tvmaze_app;
