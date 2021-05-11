const GET_ORDERS_LINK = "/api/order";
const RELEASE_ORDER_LINK = "/api/order/";

let view;

function createView() {
    return {
        "ordersTableBody": document.getElementsByTagName("tbody")[0],

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

            for (let i = 0; i < data.orders.length; i++) {
                document.getElementById("details_" + data.orders[i].id).onclick = () => window.location.assign("/orderDetails/" + data.orders[i].id);
            }

            for (let i = 0; i < data.orders.length; i++) {
                let orderId = data.orders[i].id;
                document.getElementById("release_" + orderId).onclick = () => {
                    fetch(RELEASE_ORDER_LINK + orderId, {method: "POST", redirect: "follow"})
                        .then(response => {
                            if (response.status === 200) {
                                view.modal.communicateModalTitle.innerText = "SUKCES!";
                                view.modal.communicateModalText.innerText = "Wydano zamówienie!";
                                view.modal.communicateModalButton.onclick = () => window.location.reload(true);

                                $("#communicateModal").modal('show');
                            } else {
                                view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                                view.modal.communicateModalText.innerText = "Nie udało się wydać zamówienia!";
                                view.modal.communicateModalButton.onclick = () => window.location.reload(true);

                                $("#communicateModal").modal('show');
                            }
                        });
                };
            }
        });

    view.menuButton.onclick = () => window.location.assign("/warehouse_employee/menu");
    view.logoutButton.onclick = () => logoutFunction();
});
