import hashlib

import psycopg2
from flask import Flask, Response, request, render_template

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
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT storage_units.id, storage_units.name, storage_units.description \
                         FROM storage_units ")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "id": r[0],
                    "name": r[1],
                    "description": r[2],
                }
                formatted_results.append(tmp_formatted_result)

            return {"storage_units": formatted_results}


@app.route('/api/storage_unit/<int:storage_unit_id>', methods=[GET])
def get_storage_unit(storage_unit_id):
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM storage_units WHERE id = %s", (storage_unit_id,))

            result = cur.fetchone()

            if result is None:
                return Response(status=404)
            return {"id": result[0], "name": result[1], "description": result[2]}


@app.route('/api/storage_unit', methods=[POST])
def create_storage_unit():
    name = request.form["name"]
    description = request.form["description"]

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO storage_units (name, description) VALUES (%s, %s)", (name, description))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=201)


@app.route('/api/storage_unit/<int:storage_unit_id>', methods=[DELETE])
def delete_storage_unit(storage_unit_id):
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM storage_units WHERE id = %s", (storage_unit_id,))

            conn.commit()

        return Response(status=204)


# Product API

@app.route('/api/product', methods=[GET])
def get_products():
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT products.id, products.name, products.description, storage_units.name AS storage_unit_name, products.price \
                         FROM products \
                         INNER JOIN storage_units ON storage_units.id = Products.storage_unit_id")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "id": r[0],
                    "name": r[1],
                    "description": r[2],
                    "storage_unit_name": r[3],
                    "price": r[4]
                }
                formatted_results.append(tmp_formatted_result)

            return {"products": formatted_results}


@app.route('/api/product', methods=[POST])
def create_product():
    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO products (name, description, storage_unit_id,price) VALUES (%s, %s, %s, %s)",
                            (request.form["name"], request.form["description"], request.form["storage_unit_id"],
                             request.form["price"]))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=201)


# WarehouseResource API

@app.route('/api/warehouseResource', methods=[GET])
def get_warehouse_resources():
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT warehouse_resources.id, products.name AS product_name, storage_units.name AS storage_unit_name, warehouse_resources.total_quantity, warehouse_resources.available_quantity \
                        FROM warehouse_resources \
                        INNER JOIN products ON products.id = warehouse_resources.product_id \
                        INNER JOIN storage_units ON storage_units.id = products.storage_unit_id")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "id": r[0],
                    "product_name": r[1],
                    "storage_unit_name": r[2],
                    "total_quantity": r[3],
                    "available_quantity": r[4]
                }
                formatted_results.append(tmp_formatted_result)

            return {"warehouse_resources": formatted_results}


@app.route('/api/warehouseResource', methods=[POST])
def add_warehouse_resource():
    quantity = request.form["quantity"]
    product_id = request.form["product_id"]

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM warehouse_resources WHERE product_id = %s", (product_id,))

                result = cur.fetchone()

                if result is None:
                    cur.execute(
                        "INSERT INTO warehouse_resources (product_id, total_quantity, available_quantity) VALUES (%s, %s, %s)",
                        (product_id, quantity, quantity))

                    conn.commit()
                else:
                    cur.execute("UPDATE warehouse_resources \
                    SET total_quantity = total_quantity+%s, available_quantity = available_quantity+%s \
                    WHERE product_id = %s", (quantity, quantity, product_id))

                    conn.commit()
    except:
        return Response(status=400)

    return Response(status=200)


# Role API

@app.route('/api/role', methods=[GET])
def get_roles():
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT roles.id, roles.name FROM roles")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "id": r[0],
                    "name": r[1],
                }
                formatted_results.append(tmp_formatted_result)

            return {"roles": formatted_results}


# User API

@app.route('/api/user', methods=[GET])
def get_users():
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT users.id, users.name, users.surname, users.login, roles.name AS role_name \
                        FROM users \
                        INNER JOIN roles ON roles.id = users.role_id")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "id": r[0],
                    "name": r[1],
                    "surname": r[2],
                    "login": r[3],
                    "role_name": r[4]
                }
                formatted_results.append(tmp_formatted_result)

            return {"users": formatted_results}


@app.route('/api/user', methods=[POST])
def create_user():
    name = request.form["name"]
    surname = request.form["surname"]
    login = request.form["login"]
    role_id = request.form["role_id"]
    password_hash = hashlib.sha256(login.encode()).hexdigest()

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO users (name, surname, login, password_hash, role_id) \
                            VALUES (%s, %s, %s, %s, %s)",
                            (name, surname, login, password_hash, role_id))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=201)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
