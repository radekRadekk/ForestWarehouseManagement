const GET_ORDERS_LINK = "/api/order";

let view;

function createView() {
    return {
        "ordersTableBody": document.getElementsByTagName("tbody")[0],

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    fetch(GET_ORDERS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.orders.length; i++) {
                let order = data.orders[i];
                view.ordersTableBody.innerHTML += '<tr><td>' + order.id +
                    '</td><td>' + order.client_name + '</td><td>' + order.creation_date +
                    '</td><td><button id="details_' + order.id + '">Detale</button>' +
                    '</td><td><button id="release_' + order.id + '">Wydaj</button></td></tr>';
            }
            //
            // for (let i = 0; i < data.storage_units.length; i++) {
            //     document.getElementById("delete_" + data.storage_units[i].id).onclick = () => deleteStorageUnit(data.storage_units[i].id);
            // }
        });

    view.menuButton.onclick = () => window.location.assign("/warehouse_employee/menu");
    view.logoutButton.onclick = () => logoutFunction();
});
