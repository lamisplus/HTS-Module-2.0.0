export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM0MDI4MzQ2fQ.Obh9ZUOWGzRBKtJvNZsrjD3ruWgnJJ2WJLLHPEzyY_v8Mr0pxlNfy8qPYYRvS3sF7GK_skvQt5QV7KmM0PhN4A"
    : new URLSearchParams(window.location.search).get("jwt");


