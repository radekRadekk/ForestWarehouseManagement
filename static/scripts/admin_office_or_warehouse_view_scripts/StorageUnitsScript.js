const GET_STORAGE_UNITS_LINK = "/api/storage_unit";

let view;

function createView() {
    return {
        "storageUnitsTableBody": document.getElementsByTagName("tbody")[0],

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

    fetch(GET_STORAGE_UNITS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.storage_units.length; i++) {
                let storageUnit = data.storage_units[i];
                view.storageUnitsTableBody.innerHTML += '<tr><td>' + storageUnit.id +
                    '</td><td>' + storageUnit.name + '</td><td>' + storageUnit.description +
                    '</td></tr>';
            }
        });


    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});