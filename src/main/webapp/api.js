export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzMwOTE4MjE2fQ.mLJutdn5yNvGgXJ0zpr8gmyIn9ukNiCMYge7i9zrtWZcu9D7RYtPYJk3cvAJGBxV9GXbc-BWtc6SiQHV3Id28Q"
    : new URLSearchParams(window.location.search).get("jwt");



