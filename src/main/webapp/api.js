export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzI0Mzc1OTcyfQ.FU2dAdNhNyQstebxQDZwZhUjSQvubuGFVAvPP-A-3j8uyqwGSyLBi5QtaC1R7fDZ7zkSh9UAxnHKjyyKYzS8Dw"
    : new URLSearchParams(window.location.search).get("jwt");

