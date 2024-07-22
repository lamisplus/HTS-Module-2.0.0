export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxNjY1MTg5fQ.dDWTNlwQ15dp6GQidcyYO9KXzShmQZvgdK2mSqnQjmuNJABbPJJDAm3lL2J2DgIkbhSz3cIGG2_k4cz_-rkqCg"
    : new URLSearchParams(window.location.search).get("jwt");
