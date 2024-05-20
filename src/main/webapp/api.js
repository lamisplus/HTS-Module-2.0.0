export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ?
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE2MTg0ODk1fQ.IHXTndEFK8cw8CH-H6KcyFFMqoLJC7TXUFNKWFw1OMsJD2aIn2lugUQyTY-RY1aWcfIqJkYzGyT1d4q3I3qVZg"
        : new URLSearchParams(window.location.search).get("jwt");

