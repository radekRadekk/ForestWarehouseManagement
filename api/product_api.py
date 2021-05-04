import psycopg2
from flask import Response

from constants import CONNECTION_STRING


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


def create_product(request):
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


def delete_product(product_id):
    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM products WHERE id = %s", (product_id,))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=204)
