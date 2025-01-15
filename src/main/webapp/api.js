export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM2OTUzODIyfQ.c_rXv8SfW1Dcp14vzvx8DnLfxEz9SMT0EeyPBDelMONY-cN5FffCExDBPasoDv_dtkTJDec-N6hTQF2gHi5o9Q"
    : new URLSearchParams(window.location.search).get("jwt");

export const wsUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:8383/websocket"
  : "/websocket";


