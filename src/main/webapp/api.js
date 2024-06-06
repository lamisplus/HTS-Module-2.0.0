export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
?"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE3NjY4NzY2fQ.lpyfPQ3tU3YDURxmLSjjUGv89EVMH6ojkEJC6yAZo00tPbavAt0iaONWYUb88S0e6RXuMcyLzGkNaHihYYHhoA"    : new URLSearchParams(window.location.search).get("jwt");

