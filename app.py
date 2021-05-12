import datetime

from flask import Flask, request, render_template
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

from access_decorators.admin_decorator import admin_required
from access_decorators.admin_or_office_employee_decorator import admin_or_office_employee_required
from api import user_api, role_api, warehouse_resource_api, product_api, storage_unit_api, auth_api, order_api, \
    reports_api
from constants import *

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=4)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = False

jwt = JWTManager(app)


# Views

@app.route('/', methods=[GET])
def get_login_view():
    return render_template('Login.html')


# Views - Admin Views

@app.route('/admin/menu', methods=[GET])
@admin_required()
def get_admin_employee_menu_view():
    return render_template('admin_views/Menu.html')


@app.route('/admin/users', methods=[GET])
@admin_required()
def get_users_view():
    return render_template('admin_views/Users.html')


@app.route('/admin/newUser', methods=[GET])
@admin_required()
def get_new_user_view():
    return render_template('admin_views/NewUser.html')


@app.route('/admin/storageUnits', methods=[GET])
@admin_required()
def get_admin_storage_units_view():
    return render_template('admin_views/StorageUnits.html')


@app.route('/admin/newStorageUnit', methods=[GET])
@admin_required()
def get_admin_new_storage_unit_view():
    return render_template('admin_views/NewStorageUnit.html')


@app.route('/admin/orders', methods=[GET])
@admin_required()
def get_admin_orders_view():
    return render_template('admin_views/Orders.html')


@app.route('/admin/reports', methods=[GET])
@admin_required()
def get_reports_view():
    return render_template('admin_views/Reports.html')


@app.route('/admin/reports/showReleasedProducts', methods=[GET])
@admin_required()
def get_show_released_products_view():
    return render_template('admin_views/ShowReleasedProducts.html')


# Views - Admin or Office Employee Views

@app.route('/admin_or_office/products', methods=[GET])
@admin_or_office_employee_required()
def get_admin_or_office_products_view():
    return render_template('admin_or_office_views/Products.html')


@app.route('/admin_or_office/newProduct', methods=[GET])
@admin_or_office_employee_required()
def get_new_product_view():
    return render_template('admin_or_office_views/NewProduct.html')


@app.route('/office_employee/menu', methods=[GET])
@admin_or_office_employee_required()
def get_office_employee_menu_view():
    return render_template('admin_or_office_views/Menu.html')


@app.route('/admin_or_office/newOrder', methods=[GET])
@admin_or_office_employee_required()
def get_create_order_view():
    return render_template('admin_or_office_views/NewOrder.html')


@app.route('/admin_or_office/orders', methods=[GET])
@admin_or_office_employee_required()
def get_office_employee_orders_view():
    return render_template('admin_or_office_views/Orders.html')


# Views - All

@app.route('/warehouseResources', methods=[GET])
@jwt_required()
def get_warehouse_resources_view():
    return render_template('admin_office_or_warehouse_views/WarehouseResources.html')


@app.route('/addWarehouseResource', methods=[GET])
@jwt_required()
def get_add_warehouse_resource_view():
    return render_template('admin_office_or_warehouse_views/AddWarehouseResource.html')


@app.route('/storageUnits', methods=[GET])
@jwt_required()
def get_storage_units_view():
    return render_template('admin_office_or_warehouse_views/StorageUnits.html')


@app.route('/products', methods=[GET])
@jwt_required()
def get_products_view():
    return render_template('admin_office_or_warehouse_views/Products.html')


@app.route('/warehouse_employee/menu')
@jwt_required()
def get_warehouse_employee_menu_view():
    return render_template('admin_office_or_warehouse_views/Menu.html')


@app.route('/warehouse_employee/ordersForRelease', methods=[GET])
@jwt_required()
def get_orders_for_release():
    return render_template('admin_office_or_warehouse_views/OrdersForRelease.html')


@app.route('/orderDetails/<int:order_id>', methods=[GET])
@jwt_required()
def get_order_details(order_id):
    return render_template('admin_office_or_warehouse_views/OrderDetails.html')


# Order API

@app.route('/api/order', methods=[POST])
@admin_or_office_employee_required()
def create_order():
    user_login = get_jwt_identity()
    return order_api.create_order(request, user_login)


@app.route('/api/admin/order', methods=[GET])
@admin_required()
def get_admin_orders():
    return order_api.get_orders(only_active=False)


@app.route('/api/order', methods=[GET])
@jwt_required()
def get_orders():
    return order_api.get_orders(only_active=True)


@app.route('/api/order/<int:order_id>', methods=[GET])
@jwt_required()
def get_order(order_id):
    return order_api.get_order(order_id)


@app.route('/api/order/<int:order_id>', methods=[POST])
@jwt_required()
def release_order(order_id):
    user_login = get_jwt_identity()
    return order_api.release_order(order_id, user_login)


# Reports API

@app.route('/api/reports/showReleasedProducts', methods=[POST])
@admin_required()
def show_released_products_report():
    return reports_api.show_released_products_report(request)


# StorageUnit API

@app.route('/api/storage_unit', methods=[GET])
@jwt_required()
def get_storage_units():
    return storage_unit_api.get_storage_units()


@app.route('/api/storage_unit', methods=[POST])
@admin_required()
def create_storage_unit():
    return storage_unit_api.create_storage_unit(request)


@app.route('/api/storage_unit/<int:storage_unit_id>', methods=[DELETE])
@admin_required()
def delete_storage_unit(storage_unit_id):
    return storage_unit_api.delete_storage_unit(storage_unit_id)


# Product API

@app.route('/api/product', methods=[GET])
@jwt_required()
def get_products():
    return product_api.get_products()


@app.route('/api/product', methods=[POST])
@admin_or_office_employee_required()
def create_product():
    return product_api.create_product(request)


@app.route('/api/product/<int:product_id>', methods=[DELETE])
@admin_or_office_employee_required()
def delete_product(product_id):
    return product_api.delete_product(product_id)


# WarehouseResource API

@app.route('/api/warehouseResource', methods=[GET])
@jwt_required()
def get_warehouse_resources():
    return warehouse_resource_api.get_warehouse_resources()


@app.route('/api/warehouseResource', methods=[POST])
@jwt_required()
def add_warehouse_resource():
    return warehouse_resource_api.add_warehouse_resource(request)


@app.route('/api/availableWarehouseResources', methods=[GET])
@admin_or_office_employee_required()
def get_available_warehouse_resources():
    return warehouse_resource_api.get_available_warehouse_resources()


# Role API

@app.route('/api/role', methods=[GET])
@admin_required()
def get_roles():
    return role_api.get_roles()


# User API

@app.route('/api/user', methods=[GET])
@admin_required()
def get_users():
    return user_api.get_users()


@app.route('/api/user', methods=[POST])
@admin_required()
def create_user():
    return user_api.create_user(request)


@app.route('/api/user/<int:user_id>', methods=[DELETE])
@admin_required()
def delete_user(user_id: int):
    return user_api.delete_user(user_id)


# auth API

@app.route('/api/auth', methods=[POST])
def login():
    return auth_api.login(request)


@app.route('/api/auth', methods=[PUT])
def logout():
    return auth_api.logout()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
