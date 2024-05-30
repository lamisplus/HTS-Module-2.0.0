export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE3MDcwNjk4fQ.0R56ZIUbe1E9BPoFUUiZ2L2EJzpfSAwgN149hIZdFWvr1siq7BkGrWfose6m6mqWAs3FJ8Ld790Ys8XiZ6zvnw"
        : new URLSearchParams(window.location.search).get("jwt");

