export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE5ODUwNTk1fQ.8ptLzcG-8bMePl-JpmP0L4a0l3V6oTnEeKWEc1KZsJy8iGpR0KQynpKm0goWZ1QHUBEm0s3LzSHekylQWVXBQw"
    : new URLSearchParams(window.location.search).get("jwt");
