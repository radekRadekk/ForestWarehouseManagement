const GET_AVAILABLE_WAREHOUSE_RESOURCES_LINK = "/api/availableWarehouseResources";
const CREATE_ORDER_LINK = "/api/order";

let view;
let available_warehouse_resources;
let order_positions = [];

function createView() {
    return {
        "productSelect": document.getElementById("productSelect"),
        "productNameField": document.getElementById("productNameField"),
        "storageUnitFiled": document.getElementById("storageUnitFiled"),
        "priceField": document.getElementById("priceField"),
        "availableQuantityField": document.getElementById("availableQuantityField"),
        "quantityInput": document.getElementById("quantityInput"),
        "orderPositionsTBody": document.getElementsByTagName("tbody")[0],
        "nameInput": document.getElementById("nameInput"),
        "phoneInput": document.getElementById("phoneInput"),
        "streetInput": document.getElementById("streetInput"),
        "buildingNumberInput": document.getElementById("buildingNumberInput"),
        "postcodeInput": document.getElementById("postcodeInput"),
        "townInput": document.getElementById("townInput"),

        "addProductButton": document.getElementById("addProductButton"),
        "createButton": document.getElementById("createButton"),


        "modal": {
            "communicateModalTitle": document.getElementById("communicateModalTitle"),
            "communicateModalButton": document.getElementById("communicateModalButton"),
            "communicateModalText": document.getElementById("communicateModalText")
        },

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    view = createView();

    view.addProductButton.disabled = true;
    view.createButton.disabled = true;

    await fetch(GET_AVAILABLE_WAREHOUSE_RESOURCES_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(json => available_warehouse_resources = json.available_warehouse_resources);

    renderProductSelect();

    view.productSelect.onchange = () => onChangeProductSelect();
    view.quantityInput.onchange = () => onChangeQuantityInput();
    view.addProductButton.onclick = () => onClickAddProductButton();
    view.createButton.onclick = () => onClickCreateButton();

    view.nameInput.onchange = () => setCreateButtonVisibility();
    view.phoneInput.onchange = () => setCreateButtonVisibility();
    view.streetInput.onchange = () => setCreateButtonVisibility();
    view.buildingNumberInput.onchange = () => setCreateButtonVisibility();
    view.townInput.onchange = () => setCreateButtonVisibility();

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});

function renderProductSelect() {
    view.productSelect.innerHTML = "<option value=\"-1\" selected>Wybierz produkt</option>";
    for (let i = 0; i < available_warehouse_resources.length; i++) {
        if (available_warehouse_resources[i].available_quantity > 0) {
            view.productSelect.innerHTML += '<option value="' + available_warehouse_resources[i].product_id + '">' +
                available_warehouse_resources[i].product_name + " - " +
                available_warehouse_resources[i].storage_unit_name + '</option>';
        }
    }
}

function onChangeProductSelect() {
    if (view.productSelect.value === "-1") {
        clearAddProductSection();
    } else {
        for (let i = 0; i < available_warehouse_resources.length; i++) {
            if (available_warehouse_resources[i].product_id === parseInt(view.productSelect.value)) {
                view.productNameField.value = available_warehouse_resources[i].product_name;
                view.storageUnitFiled.value = available_warehouse_resources[i].storage_unit_name;
                view.priceField.value = available_warehouse_resources[i].price;
                view.availableQuantityField.value = available_warehouse_resources[i].available_quantity;
                view.quantityInput.value = "";

                break;
            }
        }
    }
}

function onChangeQuantityInput() {
    const quantityRegex = new RegExp("^[1-9]\\d*$");

    if (view.productSelect.value !== "-1" && quantityRegex.test(view.quantityInput.value)) {
        if (parseInt(view.availableQuantityField.value) >= parseInt(view.quantityInput.value)) {
            view.addProductButton.disabled = false;
        } else {
            view.addProductButton.disabled = true;
        }
    } else {
        view.addProductButton.disabled = true;
    }
}

function onClickAddProductButton() {
    for (let i = 0; i < available_warehouse_resources.length; i++) {
        if (available_warehouse_resources[i].product_id === parseInt(view.productSelect.value)) {
            let orderPosition = {
                "product_id": available_warehouse_resources[i].product_id,
                "quantity": parseInt(view.quantityInput.value)
            };

            let added = false;
            for (let j = 0; j < order_positions.length; j++) {
                if (order_positions[j].product_id === orderPosition.product_id) {
                    order_positions[j].quantity += orderPosition.quantity;

                    added = true;
                    break;
                }
            }

            if (!added) {
                order_positions.push(orderPosition);
            }
            available_warehouse_resources[i].available_quantity -= parseInt(view.quantityInput.value);

            clearAddProductSection();
            renderProductSelect();
            renderOrderPositionsTBody();
            setCreateButtonVisibility();
        }
    }
}

function renderOrderPositionsTBody() {
    view.orderPositionsTBody.innerHTML = "";

    for (let i = 0; i < order_positions.length; i++) {
        for (let j = 0; j < available_warehouse_resources.length; j++) {
            if (order_positions[i].product_id === available_warehouse_resources[j].product_id) {
                view.orderPositionsTBody.innerHTML += '<tr><td>' + available_warehouse_resources[j].product_id +
                    '</td><td>' + available_warehouse_resources[j].product_name +
                    '</td><td>' + available_warehouse_resources[j].storage_unit_name +
                    '</td><td>' + available_warehouse_resources[j].price +
                    '</td><td>' + order_positions[i].quantity + '</td></tr>';
            }
        }
    }
}

function setCreateButtonVisibility() {
    const clientNameRegex = new RegExp("^.{1,150}$");
    const phoneNumberRegex = new RegExp("^\\+?\\d{8,13}$");
    const streetRegex = new RegExp("^.{1,50}$");
    const buildingNumberRegex = new RegExp("^[0-9a-zA-Z]{1,8}$");
    const postCodeRegex = new RegExp("^\\d\\d-\\d\\d\\d$");
    const townNumberRegex = new RegExp("^.{1,50}$");

    if (clientNameRegex.test(view.nameInput.value) &&
        phoneNumberRegex.test(view.phoneInput.value) &&
        streetRegex.test(view.streetInput.value) &&
        buildingNumberRegex.test(view.buildingNumberInput.value) &&
        postCodeRegex.test(view.postcodeInput.value) &&
        townNumberRegex.test(view.townInput.value) &&
        order_positions.length > 0) {
        view.createButton.disabled = false;
    } else {
        view.createButton.disabled = true;
    }
}

function onClickCreateButton() {
    let data = {
        "clientName": view.nameInput.value,
        "phoneNumber": view.phoneInput.value,
        "street": view.streetInput.value,
        "buildingNumber": view.buildingNumberInput.value,
        "postcode": view.postcodeInput.value,
        "town": view.townInput.value,
        "orderPositions": order_positions
    };

    fetch(CREATE_ORDER_LINK, {
        method: "POST",
        redirect: "follow",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(response => response.status)
        .then(status => {
            if (status === 201) {
                view.modal.communicateModalTitle.innerText = "SUKCES!";
                view.modal.communicateModalText.innerText = "Utworzono zamówienie!";
                view.modal.communicateModalButton.onclick = () => {
                    if (getCookie("user_role_code") === OFFICE_EMPLOYEE_CODE) {
                        window.location.assign("/admin_or_office/orders");
                    } else {
                        window.location.assign("/admin/orders");
                    }
                };

                $("#communicateModal").modal('show');
            } else {
                view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                view.modal.communicateModalText.innerText = "Nie udało się utworzyć zamówienia!";
                view.modal.communicateModalButton.onclick = () => window.location.reload(true);

                $("#communicateModal").modal('show');
            }
        });
}


function clearAddProductSection() {
    view.productNameField.value = "";
    view.storageUnitFiled.value = "";
    view.priceField.value = "";
    view.availableQuantityField.value = "";
    view.quantityInput.value = "";

    view.addProductButton.disabled = true;
}