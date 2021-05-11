import psycopg2
from flask import Response

from constants import CONNECTION_STRING


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
                if r[3] != 0:
                    tmp_formatted_result = {
                        "id": r[0],
                        "product_name": r[1],
                        "storage_unit_name": r[2],
                        "total_quantity": r[3],
                        "available_quantity": r[4]
                    }
                    formatted_results.append(tmp_formatted_result)

            return {"warehouse_resources": formatted_results}


def add_warehouse_resource(request):
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


def get_available_warehouse_resources():
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT products.id AS product_id, warehouse_resources.id AS warehouse_resource_id, products.name AS product_name, storage_units.name AS storage_unit_name, products.price, warehouse_resources.available_quantity \
                        FROM warehouse_resources \
                        INNER JOIN products ON products.id = warehouse_resources.product_id \
                        INNER JOIN storage_units ON storage_units.id = products.storage_unit_id")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                tmp_formatted_result = {
                    "product_id": r[0],
                    "warehouse_resource_id": r[1],
                    "product_name": r[2],
                    "storage_unit_name": r[3],
                    "price": r[4],
                    "available_quantity": r[5]
                }
                formatted_results.append(tmp_formatted_result)

            return {"available_warehouse_resources": formatted_results}
