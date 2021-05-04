let view;

function createView() {
    return {
        "storageUnitsImage": document.getElementById("storageUnitsImage"),
        "productsImage": document.getElementById("productsImage"),
        "warehouseResourcesImage": document.getElementById("warehouseResourcesImage"),
        "ordersImage": document.getElementById("ordersImage"),

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.storageUnitsImage.onclick = () => window.location.assign("/admin/storageUnits");
    view.productsImage.onclick = () => window.location.assign("/admin_or_office/products");

    view.menuButton.onclick = () => window.location.assign("/admin/menu");
    view.logoutButton.onclick = () => logoutFunction();
});
