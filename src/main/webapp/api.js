export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMzNDEyNzY5fQ.8PgQG-8rpd4muqSJqKqC6X6W2mOQpl2V64dfsZi1eEy-thiw9CYxSKDq-Yb76l7cmg2kwuNyRuBrnEjwXu7qHA"
    : new URLSearchParams(window.location.search).get("jwt");

