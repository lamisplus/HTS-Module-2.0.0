export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
?"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE3NjEwOTMzfQ.7ePihG--iQb1NZp8vtV6nHXFWjpmT8BpWkMqQouUgwmzqfjkb8r3QzIzUYBgWnCtQn7eiTdjpxkPhV5uTnJuAQ"    : new URLSearchParams(window.location.search).get("jwt");

