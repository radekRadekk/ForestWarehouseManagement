const GET_PRODUCTS_LINK = "/api/product";
const DELETE_PRODUCT_LINK = "/api/product/";

let view;

function createView() {
    return {
        "productsTableBody": document.getElementsByTagName("tbody")[0],
        "newProductButton": document.getElementById("addProductButton"),

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

    fetch(GET_PRODUCTS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.products.length; i++) {
                let product = data.products[i];
                view.productsTableBody.innerHTML += '<tr><td>' + product.id +
                    '</td><td>' + product.name + '</td><td>' + product.description + '</td><td>' + product.storage_unit_name + '' +
                    '</td><td>' + product.price + '</td><td><button id="delete_' + product.id + '">Usuń</button></td></tr>';
            }

            for (let i = 0; i < data.products.length; i++) {
                document.getElementById("delete_" + data.products[i].id).onclick = () => deleteProduct(data.products[i].id);
            }
        });

    view.newProductButton.onclick = () => window.location.replace("/admin_or_office/newProduct");
    // view.logoutButton.onclick = () => logout(view.modal);
});

function deleteProduct(id) {
    fetch(DELETE_PRODUCT_LINK + id, {method: "DELETE", redirect: "follow"})
        .then(response => {
            if (response.status === 204) {
                view.modal.communicateModalTitle.innerText = "SUKCES!";
                view.modal.communicateModalText.innerText = "Usunięto produkt!";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin_or_office/products");

                $("#communicateModal").modal('show');
            } else {
                view.modal.communicateModalTitle.innerText = "COŚ POSZŁO NIE TAK!";
                view.modal.communicateModalText.innerText = "Nie udało się usunąć produktu. Sprawdź czy nie ma elementów powiązanych i spróbuj ponownie.";
                view.modal.communicateModalButton.onclick = () => window.location.replace("/admin_or_office/products");

                $("#communicateModal").modal('show');
            }
        });
}