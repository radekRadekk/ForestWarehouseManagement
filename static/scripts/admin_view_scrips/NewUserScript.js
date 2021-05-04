const GET_ROLES_LINK = "/api/role";
const CREATE_USER_LINK = "/api/user";

let view;

function createView() {
    return {
        "nameInput": document.getElementById("nameInput"),
        "surnameInput": document.getElementById("surnameInput"),
        "loginInput": document.getElementById("loginInput"),
        "roleSelect": document.getElementById("roleSelect"),
        "createButton": document.getElementById("createButton"),

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

    view.createButton.disabled = true;

    fetch(GET_ROLES_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.roles.length; i++) {
                let role = data.roles[i];
                view.roleSelect.innerHTML += '<option value="' + role.id + '">' + role.name + '</option>';
            }
        });

    view.nameInput.onchange = () => setCreateButtonVisibility();
    view.surnameInput.onchange = () => setCreateButtonVisibility();
    view.loginInput.onchange = () => setCreateButtonVisibility();
    view.roleSelect.onchange = () => setCreateButtonVisibility();

    view.createButton.onclick = () => {
        if (!shouldCreateButtonBeVisible()) {
            view.createButton.disabled = true;
            return;
        }

        let name = view.nameInput.value;
        let surname = view.surnameInput.value;
        let login = view.loginInput.value;
        let roleId = view.roleSelect.value;

        let formData = new FormData();
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("login", login);
        formData.append("role_id", roleId);

        fetch(CREATE_USER_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => {
                if (response.status === 201) {
                    view.modal.communicateModalTitle.innerText = "SUKCES!";
                    view.modal.communicateModalText.innerText = "Utworzono użytkownika!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/users");

                    $("#communicateModal").modal('show');
                } else {
                    view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                    view.modal.communicateModalText.innerText = "Nie udało się użytkownika!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/newUser");

                    $("#communicateModal").modal('show');
                }
            });
    };

    // view.logoutButton.onclick = () => logout(view.modal);
});

function setCreateButtonVisibility() {
    if (shouldCreateButtonBeVisible()) {
        view.createButton.disabled = false;
    } else {
        view.createButton.disabled = true;
    }
}

function shouldCreateButtonBeVisible() {
    const nameRegex = new RegExp("^.{1,50}$");
    const surnameRegex = new RegExp("^.{1,50}$");
    const loginRegex = new RegExp("^.{1,20}$");

    if (!nameRegex.test(view.nameInput.value)) {
        return false;
    }

    if (!surnameRegex.test(view.surnameInput.value)) {
        return false;
    }

    if (!loginRegex.test(view.loginInput.value)) {
        return false;
    }

    if (view.roleSelect.value < 1) {
        return false;
    }

    return true;
}