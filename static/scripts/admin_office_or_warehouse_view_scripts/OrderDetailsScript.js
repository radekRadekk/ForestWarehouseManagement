const GET_ORDER_DETAILS_LINK = "/api/order/";

let view;

function createView() {
    return {
        "orderPositionsTBody": document.getElementsByTagName("tbody")[0],
        "nameInput": document.getElementById("nameInput"),
        "phoneInput": document.getElementById("phoneInput"),
        "streetInput": document.getElementById("streetInput"),
        "buildingNumberInput": document.getElementById("buildingNumberInput"),
        "postcodeInput": document.getElementById("postcodeInput"),
        "townInput": document.getElementById("townInput"),

        "returnButton": document.getElementById("returnButton"),


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

    let order_id = getOrderId();

    fetch(GET_ORDER_DETAILS_LINK + order_id, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(order => {
            view.nameInput.value = order.client_name;
            view.phoneInput.value = order.phone_number;
            view.streetInput.value = order.street;
            view.buildingNumberInput.value = order.building_number;
            view.postcodeInput.value = order.postcode;
            view.townInput.value = order.town;

            for (let i = 0; i < order.order_positions.length; i++) {
                let orderPosition = order.order_positions[i];
                view.orderPositionsTBody.innerHTML += '<tr><td>' + orderPosition.product_id +
                    '</td><td>' + orderPosition.product_name + '</td><td>' + orderPosition.storage_unit_name + '</td><td>' + orderPosition.price + '' +
                    '</td><td>' + orderPosition.quantity + '</td></tr>';
            }
        });

    view.returnButton.onclick = () => {
        if (getCookie("user_role_code") === OFFICE_EMPLOYEE_CODE) {
            window.location.assign("/admin_or_office/orders");
        } else if (getCookie("user_role_code") === WAREHOUSE_EMPLOYEE_CODE) {
            window.location.assign("/warehouse_employee/ordersForRelease");
        } else {
            window.location.assign("/admin/orders");
        }
    };

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});


function getOrderId() {
    let locationParts = window.location.href.split("/");
    return parseInt(locationParts[locationParts.length - 1]);
}