export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";
export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE4NDE5MDU1fQ.9JX3yc1B-uaqHcMjkZwyvfZjnbW7fi399OZVHFRBGcsT2ScJxJZlu0IE5VfVcduzgE6lWwc1x1UFmmVurMBOvg"
    : new URLSearchParams(window.location.search).get("jwt");
