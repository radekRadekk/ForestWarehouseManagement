const GET_USERS_LINK = "/api/user";
const DELETE_USER_LINK = "/api/user/";

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

        "menuButton": document.getElementById("menuButton"),
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
                    '</td><td>' + user.role_name + '</td><td><button id="delete_' + user.id + '">Usuń</button></td></tr>';
            }

            for (let i = 0; i < data.users.length; i++) {
                document.getElementById("delete_" + data.users[i].id).onclick = () => deleteUser(data.users[i].id);
            }
        });

    view.addUserButton.onclick = () => window.location.assign("/admin/newUser");

    view.menuButton.onclick = () => window.location.assign("/admin/menu");
    view.logoutButton.onclick = () => logoutFunction();
});

function deleteUser(id) {
    console.log(id);
    fetch(DELETE_USER_LINK + id, {method: "DELETE", redirect: "follow"})
        .then(response => {
            if (response.status === 204) {
                view.modal.communicateModalTitle.innerText = "SUKCES!";
                view.modal.communicateModalText.innerText = "Usunięto użytkownika!";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/users");

                $("#communicateModal").modal('show');
            } else {
                view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                view.modal.communicateModalText.innerText = "Nie udało się usunąć użytkownika. Spradź czy nie ma elementów powiązanych i spróbuj ponownie.";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/users");

                $("#communicateModal").modal('show');
            }
        });
}
