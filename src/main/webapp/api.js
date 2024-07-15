export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxMDYyMzQ2fQ.YQOP8PI7CGL_HszcktOrZGEZcNGt-oHKzx67jNpL5GLj7Lhyob0e4fngOlL2xYvkxtPXwDT81WaB5rBEZ-karw"
    : new URLSearchParams(window.location.search).get("jwt");
