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

    view.storageUnitsImage.onclick = () => window.location.assign("/storageUnits");
    view.productsImage.onclick = () => window.location.assign("/admin_or_office/products");
    view.warehouseResourcesImage.onclick = () => window.location.assign("/warehouseResources");
    view.ordersImage.onclick = () => window.location.assign("/admin_or_office/orders");

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});
