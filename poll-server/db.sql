DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
    id text,
    name text,
    winstreak bigint,
    submitted bigint,
    active boolean
);

ALTER TABLE public.users OWNER TO postgres;