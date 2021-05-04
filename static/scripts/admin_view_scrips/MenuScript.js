let view;

function createView() {
    return {
        "usersImage": document.getElementById("usersImage"),
        "storageUnitsImage": document.getElementById("storageUnitsImage"),
        "productsImage": document.getElementById("productsImage"),
        "warehouseResourcesImage": document.getElementById("warehouseResourcesImage"),
        "ordersImage": document.getElementById("ordersImage"),
        "reportsImage": document.getElementById("reportsImage"),

        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.usersImage.onclick = () => window.location.assign("/admin/users");
    view.storageUnitsImage.onclick = () => window.location.assign("/admin/storageUnits");
    view.productsImage.onclick = () => window.location.assign("/admin_or_office/products");
    // view.logoutButton.onclick = () => logout(view.modal);
});
