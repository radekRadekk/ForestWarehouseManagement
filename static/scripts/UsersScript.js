const GET_USERS_LINK = "/api/user";

let view;

function createView() {
    return {
        "usersTableBody": document.getElementsByTagName("tbody")[0],
        "addUserButton": document.getElementById("addUserButton"),

        "modal": {
            "communicateModalTitle": document.getElementById("communicateModalTitle"),
            "communicateModalButton": document.getElementById("communicateModalButton"),
            "communicateModalText": document.getElementById("communicateModalText")
        },

        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    fetch(GET_USERS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.users.length; i++) {
                let user = data.users[i];
                view.usersTableBody.innerHTML += '<tr><td>' + user.id +
                    '</td><td>' + user.name + '</td><td>' + user.surname + '</td><td>' + user.login +
                    '</td><td>' + user.role_name + '</td></tr>'
            }
        });

    view.addUserButton.onclick = () => window.location.replace("/newUser");
    // view.logoutButton.onclick = () => logout(view.modal);
});