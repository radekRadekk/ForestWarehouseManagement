const GET_ORDERS_LINK = "/api/admin/order";

let view;

function createView() {
    return {
        "ordersTableBody": document.getElementsByTagName("tbody")[0],
        "newOrderButton": document.getElementById("newOrderButton"),

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
                    '</td><td>' + order.release_date +
                    '</td><td><button id="details_' + order.id + '">Detale</button></td></tr>';
            }

            for (let i = 0; i < data.orders.length; i++) {
                document.getElementById("details_" + data.orders[i].id).onclick = () => window.location.assign("/orderDetails/" + data.orders[i].id);
            }
        });

    view.newOrderButton.onclick = () => window.location.assign("/admin_or_office/newOrder");

    view.menuButton.onclick = () => window.location.assign("/admin/menu");
    view.logoutButton.onclick = () => logoutFunction();
});
