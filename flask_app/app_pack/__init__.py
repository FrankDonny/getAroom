from datetime import timedelta

from flask import (Flask, flash, redirect, render_template, request, session,
                   url_for)
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['SECRET_KEY'] = "104c23ab6524c59b3dbc2013"
socketio = SocketIO(app)
csrf = CSRFProtect(app)
login_manager = LoginManager(app)
login_manager.init_app(app)
app.config['LOGIN_URL'] = '/login'
app.config['WTF_CSRF_ENABLED'] = True
app.config['UPLOADS_FOLDER'] = 'static/images'
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=30)


def jinja_abs(val):
    return abs(val)


app.jinja_env.filters['abs'] = jinja_abs

from app_pack.routes import *  # noqa
