from flask import Flask, request, render_template

from api import user_api, role_api, warehouse_resource_api, product_api, storage_unit_api
from constants import *

app = Flask(__name__)


# Views

@app.route('/products', methods=[GET])
def get_products_view():
    return render_template('Products.html')


@app.route('/newProduct', methods=[GET])
def get_new_product_view():
    return render_template('NewProduct.html')


@app.route('/storageUnits', methods=[GET])
def get_storage_units_view():
    return render_template('StorageUnits.html')


@app.route('/newStorageUnit', methods=[GET])
def get_new_storage_unit_view():
    return render_template('NewStorageUnit.html')


@app.route('/warehouseResources', methods=[GET])
def get_warehouse_resources_view():
    return render_template('WarehouseResources.html')


@app.route('/addWarehouseResource', methods=[GET])
def get_add_warehouse_resource_view():
    return render_template('AddWarehouseResource.html')


@app.route('/users', methods=[GET])
def get_users_view():
    return render_template('Users.html')


@app.route('/newUser', methods=[GET])
def get_new_user_view():
    return render_template('NewUser.html')


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
def get_roles():
    return role_api.get_roles()


# User API

@app.route('/api/user', methods=[GET])
def get_users():
    return user_api.get_users()


@app.route('/api/user', methods=[POST])
def create_user():
    return user_api.create_user(request)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
