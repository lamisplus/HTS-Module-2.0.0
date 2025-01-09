export const url =
  process.env.NODE_ENV === "development"
    ? "https://dev.lamisplus.org/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzM0NjM4MTcwfQ.wIA8hNOWH5C0ejdOlZRJFy0yLhRIAqDqBlDmDujbNUZ5wnKiPAmjPJrnpGaxd3YoOm22yhimbImD62KFWQyhng"
    : new URLSearchParams(window.location.search).get("jwt");
