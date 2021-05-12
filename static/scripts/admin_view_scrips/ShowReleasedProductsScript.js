const GET_SHOW_RELEASED_PRODUCTS_REPORT_LINK = "/api/reports/showReleasedProducts";

let view;

function createView() {
    return {
        "productsTableBody": document.getElementsByTagName("tbody")[0],
        "fromInput": document.getElementById("fromInput"),
        "toInput": document.getElementById("toInput"),
        "showReportButton": document.getElementById("showReportButton"),

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.showReportButton.disabled = true;

    view.fromInput.onchange = () => setShowReportButtonVisibility();
    view.toInput.onchange = () => setShowReportButtonVisibility();

    view.showReportButton.onclick = () => {
        view.showReportButton.disabled = true;

        let fromDate = new Date(view.fromInput.value);
        let toDate = new Date(view.toInput.value);

        let formData = new FormData();
        formData.append("fromDate", fromDate.toISOString());
        formData.append("toDate", toDate.toISOString());

        fetch(GET_SHOW_RELEASED_PRODUCTS_REPORT_LINK, {method: "POST", redirect: "follow", body: formData})
            .then(response => response.json())
            .then(json => {
                view.productsTableBody.innerHTML = "";

                for (let i = 0; i < json.products.length; i++) {
                    let product = json.products[i];
                    view.productsTableBody.innerHTML += '<tr><td>' + product.product_id +
                        '</td><td>' + product.product_name + '</td><td>' + product.storage_unit_name + '</td><td>' + product.quantity + '' +
                        '</td><td>' + product.price + '</td></tr>';
                }
            });
    };

    view.menuButton.onclick = () => window.location.assign("/admin/menu");
    view.logoutButton.onclick = () => logoutFunction();
});

function setShowReportButtonVisibility() {
    if (view.fromInput.value === "" || view.toInput.value === "") {
        view.showReportButton.disabled = true;
        return;
    }

    let fromDate = new Date(view.fromInput.value);
    let toDate = new Date(view.toInput.value);
    if (toDate <= fromDate) {
        view.showReportButton.disabled = true;
        return;
    }

    view.showReportButton.disabled = false;
}