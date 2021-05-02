const LOGIN_LINK = "/api/auth";

let view;

function createView() {
    return {
        "loginInput": document.getElementById("loginInput"),
        "passwordInput": document.getElementById("passwordInput"),
        "loginButton": document.getElementById("loginButton"),

        "modal": {
            "communicateModalTitle": document.getElementById("communicateModalTitle"),
            "communicateModalButton": document.getElementById("communicateModalButton"),
            "communicateModalText": document.getElementById("communicateModalText")
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.loginButton.disabled = true;

    view.loginInput.onchange = () => setLoginButtonVisibility();
    view.passwordInput.onchange = () => setLoginButtonVisibility();

    view.loginButton.onclick = () => {
        if (!shouldLoginButtonBeVisible()) {
            view.loginButton.disabled = true;
            return;
        }

        let login = view.loginInput.value;
        let password = view.passwordInput.value;


        let formData = new FormData();
        formData.append("login", login);
        formData.append("password", password);

        fetch(LOGIN_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => {
                if (response.status === 200) {

                } else {
                    view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                    view.modal.communicateModalText.innerText = "Nie udało się zalogować!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/");

                    $("#communicateModal").modal('show');
                }
            });
    };
});

function setLoginButtonVisibility() {
    if (shouldLoginButtonBeVisible()) {
        view.loginButton.disabled = false;
    } else {
        view.loginButton.disabled = true;
    }
}

function shouldLoginButtonBeVisible() {
    if (view.loginInput.value === "") {
        return false;
    }

    if (view.passwordInput.value === "") {
        return false;
    }

    return true;
}