const GET_STORAGE_UNITS_LINK = "/api/storage_unit";
const CREATE_PRODUCT_LINK = "/api/product";

let view;

function createView() {
    return {
        "nameInput": document.getElementById("nameInput"),
        "descriptionInput": document.getElementById("descriptionInput"),
        "priceInput": document.getElementById("priceInput"),
        "storageUnitSelect": document.getElementById("storageUnitSelect"),
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

    fetch(GET_STORAGE_UNITS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.storage_units.length; i++) {
                let storage_unit = data.storage_units[i];
                view.storageUnitSelect.innerHTML += '<option value="' + storage_unit.id + '">' + storage_unit.name + '</option>';
            }
        });

    view.nameInput.onchange = () => setCreateButtonVisibility();
    view.descriptionInput.onchange = () => setCreateButtonVisibility();
    view.storageUnitSelect.onchange = () => setCreateButtonVisibility();
    view.priceInput.onchange = () => setCreateButtonVisibility();

    view.createButton.onclick = () => {
        if (!shouldCreateButtonBeVisible()) {
            view.createButton.disabled = true;
            return;
        }

        let name = view.nameInput.value;
        let description = view.descriptionInput.value;
        let storageUnitId = view.storageUnitSelect.value;
        let price = view.priceInput.value;

        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("storage_unit_id", storageUnitId);
        formData.append("price", price);

        fetch(CREATE_PRODUCT_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => {
                if (response.status === 201) {
                    view.modal.communicateModalTitle.innerText = "SUKCES!";
                    view.modal.communicateModalText.innerText = "Utworzono produkt!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/products");

                    $("#communicateModal").modal('show');
                } else {
                    view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                    view.modal.communicateModalText.innerText = "Nie udało się utworzyć produktu!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/newProduct");

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
    const priceRegex = new RegExp("^\\d+,?\\d*$");

    if (!nameRegex.test(view.nameInput.value)) {
        return false;
    }

    if (!descriptionRegex.test(view.descriptionInput.value)) {
        return false;
    }

    if (!priceRegex.test(view.priceInput.value)) {
        return false;
    }

    if (view.storageUnitSelect.value < 1) {
        return false;
    }

    return true;
}