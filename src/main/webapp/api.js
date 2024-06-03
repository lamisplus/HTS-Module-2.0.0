export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
?"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE3NDI4OTM5fQ.2QRRHMJgZxa6wiStDL-HNCdlqT6fy7st4cL1sxoLiJ7do5shgSWv4DCxgYgpefmGsZFrvQzkMhjO-lEUhAVgEg"        : new URLSearchParams(window.location.search).get("jwt");

