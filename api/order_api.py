import psycopg2
from flask import Response

from constants import CONNECTION_STRING


def create_order(request, user_login):
    request_data = request.get_json()

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT users.id FROM users WHERE users.login = (%s)", (user_login,))

                user_id = cur.fetchone()[0]

                cur.execute(
                    "INSERT INTO orders (client_name, phone_number, employee_id) VALUES (%s, %s, %s) RETURNING id",
                    (request_data["clientName"], request_data["phoneNumber"], user_id))

                order_id = cur.fetchone()[0]

                cur.execute(
                    "INSERT INTO addresses (street, building_number, town, postcode, order_id) VALUES (%s, %s, %s, %s, %s)",
                    (request_data["street"], request_data["buildingNumber"], request_data["town"],
                     request_data["postcode"],
                     order_id)
                )

                for order_position in request_data["orderPositions"]:
                    cur.execute("INSERT INTO order_positions (product_id, quantity, order_id) VALUES (%s, %s, %s)",
                                (order_position["product_id"], order_position["quantity"], order_id))

                    cur.execute("UPDATE warehouse_resources \
                                SET available_quantity = available_quantity-(%s) WHERE product_id = (%s)",
                                (order_position["quantity"], order_position["product_id"]))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=201)


def get_orders(only_active):
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT orders.id, orders.client_name, orders.date AS creation_date, receipts.date AS release_date \
                        FROM orders \
                        LEFT JOIN receipts ON receipts.order_id = orders.id")

            result = cur.fetchall()

            formatted_results = []
            for r in result:
                if only_active:
                    if r[3] == None:
                        tmp_formatted_result = {
                            "id": r[0],
                            "client_name": r[1],
                            "creation_date": r[2],
                        }
                        formatted_results.append(tmp_formatted_result)
                else:
                    if r[3] == None:
                        tmp_formatted_result = {
                            "id": r[0],
                            "client_name": r[1],
                            "creation_date": r[2],
                            "release_date": ""
                        }
                        formatted_results.append(tmp_formatted_result)
                    else:
                        tmp_formatted_result = {
                            "id": r[0],
                            "client_name": r[1],
                            "creation_date": r[2],
                            "release_date": r[3]
                        }
                        formatted_results.append(tmp_formatted_result)

            return {"orders": formatted_results}


def get_order(order_id):
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT orders.id, orders.client_name, orders.phone_number, addresses.street, addresses.building_number, addresses.town, addresses.postcode \
                        FROM orders \
                        INNER JOIN addresses ON addresses.order_id = orders.id \
                        WHERE orders.id = %s", (order_id,))

            result = cur.fetchone()

            if result is None:
                return Response(status=404)

            cur.execute("SELECT products.id AS product_id, products.name AS product_name, storage_units.name AS storage_unit_name, products.price, order_positions.quantity \
                        FROM order_positions \
                        INNER JOIN products ON products.id = order_positions.product_id \
                        INNER JOIN storage_units ON storage_units.id = products.storage_unit_id \
                        WHERE order_positions.order_id = %s", (order_id,))

            order_positions = cur.fetchall()

            formatted_order_positions = []
            for order_position in order_positions:
                formatted = {
                    "product_id": order_position[0],
                    "product_name": order_position[1],
                    "storage_unit_name": order_position[2],
                    "price": order_position[3],
                    "quantity": order_position[4]
                }
                formatted_order_positions.append(formatted)

            return {
                "id": result[0],
                "client_name": result[1],
                "phone_number": result[2],
                "street": result[3],
                "building_number": result[4],
                "town": result[5],
                "postcode": result[6],
                "order_positions": formatted_order_positions
            }


def release_order(order_id, user_login):
    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT users.id FROM users WHERE users.login = (%s)", (user_login,))

                user_id = cur.fetchone()[0]

                cur.execute("UPDATE warehouse_resources \
                            SET total_quantity = total_quantity-positions.quantity \
                            FROM ( \
	                            SELECT order_positions.product_id, order_positions.quantity \
	                            FROM order_positions \
	                            WHERE order_positions.order_id = %s \
                            ) AS positions \
                            WHERE \
                            warehouse_resources.product_id = positions.product_id", (order_id,))

                cur.execute(
                    "INSERT INTO receipts (order_id, employee_id) VALUES (%s, %s)", (order_id, user_id))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=200)
