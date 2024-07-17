export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwbnMiLCJhdXRoIjoiSW5kZXggRlAgYW5kIGNhc2UgbWFuYWdlcnMgICAgXHQiLCJuYW1lIjoicG5zIHRlc3QiLCJleHAiOjE3MjEyNjU5ODF9.THgpM9MenhmjeM3VzcTmeuYYZgEocxys1yVS7i6J2yOl9zZgR_foZmhabPYSDbLj5oSAVVrA1a0exRVWPRX75g"
    : new URLSearchParams(window.location.search).get("jwt");
