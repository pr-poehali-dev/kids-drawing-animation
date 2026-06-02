"""
Авторизация: отправка OTP-кода, верификация, получение профиля, выход.
Поддерживает вход по телефону или email.
"""
import json
import os
import random
import secrets
import string
import re
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p51951279_kids_drawing_animati")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status: int, body: dict):
    return {"statusCode": status, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps(body, ensure_ascii=False)}


def detect_login_type(login: str) -> str:
    """phone если начинается с + или цифры, иначе email"""
    login = login.strip()
    if re.match(r"^[\+\d]", login):
        return "phone"
    return "email"


def normalize_login(login: str) -> str:
    login = login.strip().lower()
    if detect_login_type(login) == "phone":
        digits = re.sub(r"\D", "", login)
        if digits.startswith("8") and len(digits) == 11:
            digits = "7" + digits[1:]
        return "+" + digits
    return login


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def generate_token() -> str:
    return secrets.token_hex(32)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # POST ?action=send-code — отправить OTP
    if method == "POST" and action == "send-code":
        body = json.loads(event.get("body") or "{}")
        raw_login = body.get("login", "").strip()
        if not raw_login:
            return resp(400, {"error": "Введи телефон или email"})

        login = normalize_login(raw_login)
        login_type = detect_login_type(login)
        code = generate_otp()

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.otp_codes SET used=TRUE WHERE login=%s AND used=FALSE",
            (login,)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.otp_codes (login, code) VALUES (%s, %s)",
            (login, code)
        )
        conn.commit()
        cur.close()
        conn.close()

        return resp(200, {
            "ok": True,
            "login_type": login_type,
            "code_hint": code,
        })

    # POST ?action=verify — проверить OTP, выдать токен
    if method == "POST" and action == "verify":
        body = json.loads(event.get("body") or "{}")
        raw_login = body.get("login", "").strip()
        code = body.get("code", "").strip()
        name = body.get("name", "").strip() or None

        if not raw_login or not code:
            return resp(400, {"error": "Нужны login и code"})

        login = normalize_login(raw_login)
        login_type = detect_login_type(login)

        conn = get_conn()
        cur = conn.cursor()

        cur.execute(
            f"""SELECT id FROM {SCHEMA}.otp_codes
                WHERE login=%s AND code=%s AND used=FALSE AND expires_at > NOW()
                ORDER BY created_at DESC LIMIT 1""",
            (login, code)
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return resp(400, {"error": "Неверный или устаревший код"})

        otp_id = row[0]
        cur.execute(f"UPDATE {SCHEMA}.otp_codes SET used=TRUE WHERE id=%s", (otp_id,))

        cur.execute(f"SELECT id, name FROM {SCHEMA}.users WHERE login=%s", (login,))
        user_row = cur.fetchone()
        if user_row:
            user_id, user_name = user_row
            if name and not user_name:
                cur.execute(f"UPDATE {SCHEMA}.users SET name=%s WHERE id=%s", (name, user_id))
                user_name = name
        else:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (login, login_type, name) VALUES (%s,%s,%s) RETURNING id, name",
                (login, login_type, name)
            )
            user_id, user_name = cur.fetchone()

        token = generate_token()
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user_id, token)
        )
        conn.commit()
        cur.close()
        conn.close()

        return resp(200, {
            "ok": True,
            "token": token,
            "user": {"id": str(user_id), "login": login, "login_type": login_type, "name": user_name},
        })

    # GET /me — получить профиль по токену
    if method == "GET" and action == "me":
        token = event.get("headers", {}).get("X-Auth-Token", "")
        if not token:
            return resp(401, {"error": "Не авторизован"})

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.login, u.login_type, u.name
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON u.id = s.user_id
                WHERE s.token=%s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return resp(401, {"error": "Сессия истекла"})

        user_id, login, login_type, name = row
        return resp(200, {"user": {"id": str(user_id), "login": login, "login_type": login_type, "name": name}})

    # POST /logout
    if method == "POST" and action == "logout":
        token = event.get("headers", {}).get("X-Auth-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at=NOW() WHERE token=%s", (token,))
            conn.commit()
            cur.close()
            conn.close()
        return resp(200, {"ok": True})

    return resp(404, {"error": "Not found"})