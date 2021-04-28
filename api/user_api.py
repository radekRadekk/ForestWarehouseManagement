import hashlib

import psycopg2
from flask import Response

from constants import CONNECTION_STRING


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


def create_user(request):
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
