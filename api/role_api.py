import psycopg2

from constants import CONNECTION_STRING


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
