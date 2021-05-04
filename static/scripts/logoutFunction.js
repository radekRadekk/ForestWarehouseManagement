const LOGOUT_LINK = "/api/auth";

function logoutFunction() {
    fetch(LOGOUT_LINK, {method: "PUT", redirect: "follow"}).then(r => window.location.assign("/"));
}