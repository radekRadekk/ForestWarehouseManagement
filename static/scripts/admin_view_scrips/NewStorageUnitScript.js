const CREATE_STORAGE_UNIT_LINK = "/api/storage_unit";

let view;

function createView() {
    return {
        "nameInput": document.getElementById("nameInput"),
        "descriptionInput": document.getElementById("descriptionInput"),
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

    view.nameInput.onchange = () => setCreateButtonVisibility();
    view.descriptionInput.onchange = () => setCreateButtonVisibility();

    view.createButton.onclick = () => {
        if (!shouldCreateButtonBeVisible()) {
            view.createButton.disabled = true;
            return;
        }

        let name = view.nameInput.value;
        let description = view.descriptionInput.value;


        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        fetch(CREATE_STORAGE_UNIT_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => {
                if (response.status === 201) {
                    view.modal.communicateModalTitle.innerText = "SUKCES!";
                    view.modal.communicateModalText.innerText = "Utworzono jednostkę magazynową!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/storageUnits");

                    $("#communicateModal").modal('show');
                } else {
                    view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                    view.modal.communicateModalText.innerText = "Nie udało się utworzyć jednostki magazynowej!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/newStorageUnit");

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
    const nameRegex = new RegExp(".{1,50}");
    const descriptionRegex = new RegExp(".{1,100}");

    if (!nameRegex.test(view.nameInput.value)) {
        return false;
    }

    if (!descriptionRegex.test(view.descriptionInput.value)) {
        return false;
    }

    return true;
}