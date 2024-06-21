export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4OTg5MzA4fQ.7UioceiFa75eYvmPWrmX4W8QpnaiqF1jzJ7Fi89kK9ohxBlt7M21hdKaWd-ALXOyxuMcOMDpp1gXfuxjrFCCqQ"
    : new URLSearchParams(window.location.search).get("jwt");
