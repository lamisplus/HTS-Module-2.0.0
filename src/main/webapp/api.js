export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIzMjI0NjQ2fQ.NwV0k8jJLt1bvqmRKBPhxZFbr1Vub_yiAJbhvWWOMlHyt5A9qhHDPUO8v5xKPyQumiOjj7NM2xnD513Qdi1nUw"
    : new URLSearchParams(window.location.search).get("jwt");
