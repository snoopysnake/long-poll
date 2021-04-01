--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-03-29 15:47:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 201 (class 1255 OID 32770)
-- Name: notify_user_event(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_user_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	PERFORM pg_notify('new_user_event', row_to_json(NEW)::text);
	RETURN NULL;
END;
$$;


ALTER FUNCTION public.notify_user_event() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 24583)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text,
    name text,
    winstreak bigint,
    submitted bigint,
    active boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 2981 (class 0 OID 24583)
-- Dependencies: 200
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, winstreak, submitted, active) FROM stdin;
\.


--
-- TOC entry 2850 (class 2620 OID 32771)
-- Name: users updated_user_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_user_trigger AFTER INSERT OR DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.notify_user_event();


-- Completed on 2021-03-29 15:47:18

--
-- PostgreSQL database dump complete
--

