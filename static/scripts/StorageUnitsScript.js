const GET_STORAGE_UNITS_LINK = "/api/storage_unit";

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
                    '</td><td>' + storageUnit.name + '</td><td>' + storageUnit.description + '</td></tr>';
            }
        });

    view.newStorageUnitButton.onclick = () => window.location.replace("/newStorageUnit");
    // view.logoutButton.onclick = () => logout(view.modal);
});