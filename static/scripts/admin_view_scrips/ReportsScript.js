let view;

function createView() {
    return {
        "showReleasedProductsButton": document.getElementById("showReleasedProductsButton"),

        "menuButton": document.getElementById("menuButton"),
        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    view.showReleasedProductsButton.onclick = () => window.location.assign("/admin/reports/showReleasedProducts");

    view.menuButton.onclick = () => window.location.assign("/admin/menu");
    view.logoutButton.onclick = () => logoutFunction();
});