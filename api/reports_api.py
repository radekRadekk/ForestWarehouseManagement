import psycopg2

from constants import CONNECTION_STRING


def show_released_products_report(request):
    from_date = request.form["fromDate"]
    to_date = request.form["toDate"]

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT show_released_products(%s,%s)", (from_date, to_date))

                result = cur.fetchall()

                formatted_result = []
                for r in result:
                    r_values = r[0].replace('(', '').replace(')', '').split(',')
                    price = r_values[4].replace('"', '') + ',' + r_values[5].replace('"', '')
                    tmp = {
                        "product_id": r_values[0],
                        "product_name": r_values[1],
                        "storage_unit_name": r_values[2],
                        "quantity": r_values[3],
                        "price": price
                    }
                    formatted_result.append(tmp)

                return {"products": formatted_result}
    except:
        return Response(status=400)
