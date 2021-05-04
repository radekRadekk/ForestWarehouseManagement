import hashlib

import psycopg2
from flask import Response, json
from flask_jwt_extended import create_access_token

from constants import CONNECTION_STRING


def login(request):
    user_login = request.form["login"]
    password = request.form["password"]
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        with psycopg2.connect(CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT users.password_hash, roles.code \
                            FROM users \
                            INNER JOIN roles ON users.role_id = roles.id \
                            WHERE users.login = %s", (user_login,))

                result = cur.fetchone()

                if result is None:
                    return Response(status=400)
                elif result[0] != password_hash:
                    return Response(status=400)
                else:
                    data = {"user_role_code": result[1]}
                    response = Response(status=200, response=json.dumps(data))
                    token = create_access_token(identity=user_login, additional_claims={"user_role_code": result[1]})
                    response.set_cookie("access_token_cookie", token, max_age=4 * 60 * 60, path='/', httponly=True)
                    response.set_cookie("user_role_code", result[1], max_age=4 * 60 * 60, path='/')

                    return response
    except:
        return Response(status=400)


def logout():
    response = Response(status=200)
    response.set_cookie("access_token_cookie", "", max_age=-1, path='/', httponly=True)

    return response
