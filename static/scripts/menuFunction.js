const OFFICE_EMPLOYEE_CODE = "office_employee";
const WAREHOUSE_EMPLOYEE_CODE = "warehouse_employee";

function menuFunction() {
    if (getCookie("user_role_code") === OFFICE_EMPLOYEE_CODE) {
        window.location.assign("/office_employee/menu");
    } else if (getCookie("user_role_code") === WAREHOUSE_EMPLOYEE_CODE) {
        window.location.assign("/warehouse_employee/menu");
    } else {
        window.location.assign("/admin/menu");
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}