const GET_PRODUCTS_LINK = "/api/product";
const ADD_WAREHOUSE_RESOURCE_LINK = "/api/warehouseResource";

let view;

function createView() {
    return {
        "productSelect": document.getElementById("productSelect"),
        "quantityInput": document.getElementById("quantityInput"),
        "addButton": document.getElementById("addButton"),

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

    view.addButton.disabled = true;

    fetch(GET_PRODUCTS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.products.length; i++) {
                let product = data.products[i];
                view.productSelect.innerHTML += '<option value="' + product.id + '">' + product.name + " [" +
                    product.storage_unit_name + "]" + '</option>';
            }
        });

    view.productSelect.onchange = () => setAddButtonVisibility();
    view.quantityInput.onchange = () => setAddButtonVisibility();

    view.addButton.onclick = () => {
        if (!shouldAddButtonBeVisible()) {
            view.addButton.disabled = true;
            return;
        }

        let productId = view.productSelect.value;
        let quantity = view.quantityInput.value;

        let formData = new FormData();
        formData.append("product_id", productId);
        formData.append("quantity", quantity);

        fetch(ADD_WAREHOUSE_RESOURCE_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => {
                if (response.status === 200) {
                    view.modal.communicateModalTitle.innerText = "SUKCES!";
                    view.modal.communicateModalText.innerText = "Dodano zasoby!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/warehouseResources");

                    $("#communicateModal").modal('show');
                } else {
                    view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                    view.modal.communicateModalText.innerText = "Nie udało się dodać zasobów!";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/addWarehouseResource");

                    $("#communicateModal").modal('show');
                }
            });
    };

    // view.logoutButton.onclick = () => logout(view.modal);
});

function setAddButtonVisibility() {
    if (shouldAddButtonBeVisible()) {
        view.addButton.disabled = false;
    } else {
        view.addButton.disabled = true;
    }
}

function shouldAddButtonBeVisible() {
    const quantityRegex = new RegExp("^[1-9]\\d*$");

    if (!quantityRegex.test(view.quantityInput.value)) {
        return false;
    }

    if (view.productSelect.value < 1) {
        return false;
    }

    return true;
}