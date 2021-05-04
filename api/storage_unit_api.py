import psycopg2
from flask import Response

from constants import CONNECTION_STRING


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


def get_storage_unit(storage_unit_id):
    with psycopg2.connect(CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM storage_units WHERE id = %s", (storage_unit_id,))

            result = cur.fetchone()

            if result is None:
                return Response(status=404)
            return {"id": result[0], "name": result[1], "description": result[2]}


def create_storage_unit(request):
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


def delete_storage_unit(storage_unit_id):
    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM storage_units WHERE id = %s", (storage_unit_id,))

                conn.commit()
    except:
        return Response(status=400)

    return Response(status=204)
