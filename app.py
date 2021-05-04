import datetime

from flask import Flask, request, render_template
from flask_jwt_extended import JWTManager

from access_decorators.admin_decorator import admin_required
from api import user_api, role_api, warehouse_resource_api, product_api, storage_unit_api, auth_api
from constants import *

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=4)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

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
def get_admin_storage_units_view():
    return render_template('admin_views/StorageUnits.html')


@app.route('/admin/newStorageUnit', methods=[GET])
def get_admin_new_storage_unit_view():
    return render_template('admin_views/NewStorageUnit.html')


# Views - Admin or Office Employee Views

@app.route('/products', methods=[GET])
def get_products_view():
    return render_template('admin_or_office_views/Products.html')


@app.route('/newProduct', methods=[GET])
def get_new_product_view():
    return render_template('admin_or_office_views/NewProduct.html')


@app.route('/warehouseResources', methods=[GET])
def get_warehouse_resources_view():
    return render_template('admin_office_or_warehouse_views/WarehouseResources.html')


@app.route('/addWarehouseResource', methods=[GET])
def get_add_warehouse_resource_view():
    return render_template('admin_office_or_warehouse_views/AddWarehouseResource.html')


# StorageUnit API

@app.route('/api/storage_unit', methods=[GET])
def get_storage_units():
    return storage_unit_api.get_storage_units()


@app.route('/api/storage_unit/<int:storage_unit_id>', methods=[GET])
def get_storage_unit(storage_unit_id):
    return storage_unit_api.get_storage_unit(storage_unit_id)


@app.route('/api/storage_unit', methods=[POST])
def create_storage_unit():
    return storage_unit_api.create_storage_unit(request)


@app.route('/api/storage_unit/<int:storage_unit_id>', methods=[DELETE])
def delete_storage_unit(storage_unit_id):
    return storage_unit_api.delete_storage_unit(storage_unit_id)


# Product API

@app.route('/api/product', methods=[GET])
def get_products():
    return product_api.get_products()


@app.route('/api/product', methods=[POST])
def create_product():
    return product_api.create_product(request)


# WarehouseResource API

@app.route('/api/warehouseResource', methods=[GET])
def get_warehouse_resources():
    return warehouse_resource_api.get_warehouse_resources()


@app.route('/api/warehouseResource', methods=[POST])
def add_warehouse_resource():
    return warehouse_resource_api.add_warehouse_resource(request)


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


# auth API

@app.route('/api/auth', methods=[POST])
def login():
    return auth_api.login(request)


@app.route('/api/auth', methods=[PUT])
def logout():
    return auth_api.logout()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
