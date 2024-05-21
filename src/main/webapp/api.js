export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8789/api/v1/"
        : "/api/v1/";
export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzE2MjIxOTUxfQ.vCpgoRHdbbDO8MGLvTk6zEVV5vqm_s73mSX23lcFjmBytbMh6XatapbQmRyREyzi846RpSe159rLDvoPy0Huyg"
        : new URLSearchParams(window.location.search).get("jwt");



