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
