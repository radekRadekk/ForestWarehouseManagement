const GET_PRODUCTS_LINK = "/api/product";

let view;

function createView() {
    return {
        "productsTableBody": document.getElementsByTagName("tbody")[0],

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

    fetch(GET_PRODUCTS_LINK, {method: "GET", redirect: "follow"})
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.products.length; i++) {
                let product = data.products[i];
                view.productsTableBody.innerHTML += '<tr><td>' + product.id +
                    '</td><td>' + product.name + '</td><td>' + product.description + '</td><td>' + product.storage_unit_name + '' +
                    '</td><td>' + product.price + '</td></tr>';
            }

        });

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});
