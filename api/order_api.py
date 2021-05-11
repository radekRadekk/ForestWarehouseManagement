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
                    if r[3] != None:
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
