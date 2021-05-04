const GET_WAREHOUSE_RESOURCES_LINK = "/api/warehouseResource";

let view;

function createView() {
    return {
        "warehouseResourcesTableBody": document.getElementsByTagName("tbody")[0],
        "addWarehouseResourceButton": document.getElementById("addWarehouseResourceButton"),

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

    fetch(GET_WAREHOUSE_RESOURCES_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.warehouse_resources.length; i++) {
                let warehouseResource = data.warehouse_resources[i];
                view.warehouseResourcesTableBody.innerHTML += '<tr><td>' + warehouseResource.id +
                    '</td><td>' + warehouseResource.product_name + '</td><td>' + warehouseResource.storage_unit_name +
                    '</td><td>' + warehouseResource.total_quantity + '</td><td>' + warehouseResource.available_quantity +
                    '</td></tr>';
            }
        });

    view.addWarehouseResourceButton.onclick = () => window.location.replace("/addWarehouseResource");

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});