const GET_STORAGE_UNITS_LINK = "/api/storage_unit";
const DELETE_STORAGE_UNIT_LINK = "/api/storage_unit/";

let view;

function createView() {
    return {
        "storageUnitsTableBody": document.getElementsByTagName("tbody")[0],
        "newStorageUnitButton": document.getElementById("addStorageUnitButton"),

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

    fetch(GET_STORAGE_UNITS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.storage_units.length; i++) {
                let storageUnit = data.storage_units[i];
                view.storageUnitsTableBody.innerHTML += '<tr><td>' + storageUnit.id +
                    '</td><td>' + storageUnit.name + '</td><td>' + storageUnit.description +
                    '</td><td><button id="delete_' + storageUnit.id + '">Usuń</button></td></tr>';
            }

            for (let i = 0; i < data.storage_units.length; i++) {
                document.getElementById("delete_" + data.storage_units[i].id).onclick = () => deleteStorageUnit(data.storage_units[i].id);
            }
        });

    view.newStorageUnitButton.onclick = () => window.location.replace("/admin/newStorageUnit");
    // view.logoutButton.onclick = () => logout(view.modal);
});

function deleteStorageUnit(id) {
    fetch(DELETE_STORAGE_UNIT_LINK + id, {method: "DELETE", redirect: "follow"})
        .then(response => {
            if (response.status === 204) {
                view.modal.communicateModalTitle.innerText = "SUKCES!";
                view.modal.communicateModalText.innerText = "Usunięto jednostkę magazynową!";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/storageUnits");

                $("#communicateModal").modal('show');
            } else {
                view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                view.modal.communicateModalText.innerText = "Nie udało się usunąć jednostki magazynowej. Sprawdź czy nie ma elementów powiązanych i spróbuj ponownie.";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin/storageUnits");

                $("#communicateModal").modal('show');
            }
        });
}