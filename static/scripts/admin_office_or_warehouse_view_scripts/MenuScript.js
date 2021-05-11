let view;

function createView() {
    return {
        "receiptImage": document.getElementById("receiptImage"),
        "storageUnitsImage": document.getElementById("storageUnitsImage"),
        "productsImage": document.getElementById("productsImage"),
        "warehouseResourcesImage": document.getElementById("warehouseResourcesImage"),

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.receiptImage.onclick = () => window.location.assign('/warehouse_employee/ordersForRelease');
    view.storageUnitsImage.onclick = () => window.location.assign("/storageUnits");
    view.productsImage.onclick = () => window.location.assign("/products");
    view.warehouseResourcesImage.onclick = () => window.location.assign("/warehouseResources");

    view.menuButton.onclick = () => menuFunction();
    view.logoutButton.onclick = () => logoutFunction();
});
