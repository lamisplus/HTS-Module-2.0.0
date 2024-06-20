export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4ODk3OTIyfQ.XvtWuy6WJzVnLxb84wDESdLlQIUmtooPnRkG7-0kXr00kYdnGtwUlzQyoNwH0fie4AmOaEQtHaa2kIksUhKvtA"
    : new URLSearchParams(window.location.search).get("jwt");
