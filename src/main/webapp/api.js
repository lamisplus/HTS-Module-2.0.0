export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
?"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE3NzY1Mjk3fQ.mbKuFzeDqd-OyDrxP1ri6lEmdMQoXZ3M4hQ_vkYoVF4SPcnhNdGJVKno0llA9RpWnZKw2yO2FEIEIkwpDeM_2A"    : new URLSearchParams(window.location.search).get("jwt");

