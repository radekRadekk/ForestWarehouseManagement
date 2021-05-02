from functools import wraps

from flask import Response
from flask_jwt_extended import get_jwt
from flask_jwt_extended import verify_jwt_in_request

from constants import ADMIN_EMPLOYEE_CODE


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["user_role_code"] == ADMIN_EMPLOYEE_CODE:
                return fn(*args, **kwargs)
            else:
                return Response(status=403)

        return decorator

    return wrapper
