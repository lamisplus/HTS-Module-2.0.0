export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxNjY3Njk4fQ.-T8JoRchgcB2ygmwFYJlfPNIbSdBQbKAnrd2MhE4hHO2q6RPjAiFskxWKAiZBuGqBlX-U6ihySrtFZ4Eg5te5w"
    : new URLSearchParams(window.location.search).get("jwt");
