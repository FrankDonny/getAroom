import csv
import hashlib
import secrets
from datetime import datetime
import random
from os import path

from app_pack import (app, current_user, flash, login_manager, login_required,
                      login_user, logout_user, redirect, render_template,
                      request, session, url_for)
from app_pack.validation import (ForgottenPassword, LoginForm, ProfileForm,
                                 RoomForm, SignupForm, UpdateForm)
from flask import jsonify
from jinja2 import Environment

from models import storage
from models.messages import Message
from models.reviews import Review
from models.roomMembers import RoomMember
from models.rooms import Room
from models.users import User


def jinja_abs(val):
    return abs(val)


env = Environment()
env.globals.update(abs=jinja_abs)


@login_manager.user_loader
def load_user(user_id):
    """funtion to load user session"""
    return storage.get("User", user_id)


@app.errorhandler(404)
def errorHandler(error):
    """handles 404 error occurences"""
    return render_template("error404.html")


@app.errorhandler(401)
def errorHandler401(error):
    """handles 401 error occurences"""
    return redirect(url_for('login'))


@app.route("/")
def index():
    """index route of the site"""
    if current_user.is_authenticated:  # type: ignore
        flash("You are already logged in", "error")
        return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore  # noqa
    reviews = storage.all("Review").values()
    users = storage.all("User").values()
    userReview = []
    for review in reviews:
        for user in users:
            if review.user_id == user.id:
                userReview.append(
                    [user.name, user.profile_image, review.text, review.created_at])  # noqa
    revs = []
    for _ in range(0, 2):
        value = random.randint(0, len(userReview) - 1)
        revs.append(userReview[value])
    return render_template("index.html", reviews=revs)


@app.route("/rooms/<user_id>", methods=["GET", "POST"])
@app.route("/rooms", methods=["GET", "POST"])
@login_required
def rooms(user_id=None):
    """rooms route to return the list of all rooms"""
    if current_user.is_authenticated:  # type: ignore
        form = RoomForm()
        updateForm = UpdateForm()
        timestamp = datetime.utcnow()
        if user_id is None:
            return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore  # noqa

        if current_user.id[:13] != user_id:  # type: ignore
            return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore  # noqa

        if request.method == "POST":
            if 'formUpdate' in request.form:
                roomUpdate = storage.getBy_name("Room", updateForm.roomNameToUpdate.data)  # noqa
                if roomUpdate is None:
                    flash("Room does not exist", "error")
                    return redirect(url_for('rooms'))
                elif roomUpdate.creator_id != current_user.id:  # type: ignore  # noqa
                    flash(f"You are not authorized to update '{roomUpdate.name}' room", "error")  # noqa
                    return redirect(url_for('rooms'))
                roomUpdate.name = updateForm.updateName.data  # type: ignore
                roomUpdate.description = updateForm.updateDescription.data  # type: ignore  # noqa
                setattr(roomUpdate, "updated_at", datetime.utcnow())
                storage.save()
                flash("You updated the room successfully", "success")
                return redirect(url_for('rooms'))
            elif 'roomID' in request.form:
                for member in storage.all("RoomMember").values():
                    if member.user_id == current_user.id and member.room_id == request.form.get('roomID'):  # type: ignore # noqa
                        storage.delete(member)
                    storage.save()
                theRoom = storage.get("Room", request.form.get('roomID'))
                theName = theRoom.name  # type: ignore
                storage.delete(theRoom)
                storage.save()
                flash(f"'{theName}' Room deleted", "success")
                return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore  # noqa
            elif 'join' in request.form:
                memberObj = storage.getBy_userID_roomID('RoomMember', current_user.id, request.form.get('rooomID'))  # type: ignore # noqa
                if memberObj and memberObj.room_id == request.form.get('rooomID') and memberObj.user_id == current_user.id:  # type: ignore # noqa
                    return redirect(url_for('chatroom',
                                            user_id=current_user.id[:13],  # type: ignore # noqa
                                            room_id=memberObj.room_id))
                else:
                    newMember = RoomMember(room_id=request.form.get('rooomID'),
                                           user_id=current_user.id)  # type: ignore # noqa
                    storage.new(newMember)
                    storage.save()
                    return redirect(url_for('chatroom',
                                            user_id=current_user.id[:13],  # type: ignore # noqa
                                            room_id=newMember.room_id))
            elif 'reviewText' in request.form:
                newReview = Review(text=request.form.get('reviewText'),
                                   user_id=current_user.id)  # type: ignore
                storage.new(newReview)
                storage.save()
                return ("Review has been submitted")
            else:
                roomOld = storage.getBy_name("Room", form.roomName.data)  # noqa
                if roomOld:
                    flash('Room already exist', "error")
                    return redirect(url_for('rooms'))
                newRoom = Room(name=form.roomName.data,
                               description=form.roomDescription.data,
                               creator_id=current_user.id)  # type: ignore
                storage.new(newRoom)
                storage.save()
                newMember = RoomMember(room_id=newRoom.id,
                                       user_id=current_user.id)  # type: ignore
                storage.new(newMember)
                storage.save()
                flash(f"New room created: '{newRoom.name}'", "success")
                return redirect(url_for('rooms'))  # type: ignore # noqa

        newDict = []
        for user in storage.all("User").values():
            for room in storage.all("Room").values():
                if room.creator_id == user.id:
                    newDict.append({'userName': user.name,
                                    'roomName': room.name,
                                    'roomDescription': room.description,
                                    'created_at': room.created_at,
                                    'creator_id': room.creator_id,
                                    'profileImg': user.profile_image,
                                    'roomID': room.id,
                                    'count': storage.countMembers('RoomMember', room.id)})  # type: ignore # noqa
        newDict.sort(key=lambda x: x['created_at'], reverse=True)

        messages = []
        for message in storage.all("Message").values():
            for user in storage.all("User").values():
                if message.user_id == user.id:
                    room = storage.get("Room", message.room_id)
                    messages.append([user.name,
                                     room.name,  # type: ignore # noqa
                                     message.text,
                                     user.profile_image,
                                     message.created_at])  # type: ignore # noqa
        messages.sort(key=lambda x: x[4], reverse=True)
        sortedMessages = []
        i = 0
        while i < len(messages):
            sortedMessages.append(messages[i])
            i += 1
            if i == 10:
                break
        numOfWeek = {7: 1, 14: 2, 21: 3, 28: 4, 35: 5, 42: 6, 49: 7, 56: 8,
                     63: 9, 70: 10, 77: 11, 84: 12, 91: 13, 98: 14, 105: 15, 112: 16,  # noqa
                     119: 17, 126: 18, 133: 19, 140: 20, 147: 21, 154: 22, 161: 23,  # noqa
                     168: 24, 175: 25, 182: 26, 189: 27, 196: 28, 203: 29, 210: 30,  # noqa
                     217: 31, 224: 32, 231: 33, 238: 34, 245: 35, 252: 36, 259: 37,  # noqa
                     266: 38, 273: 39, 280: 40, 287: 41, 294: 42, 301: 43, 308: 44,  # noqa
                     315: 45, 322: 46, 329: 47, 336: 48, 343: 49, 350: 50, 356: 51}  # noqa
        return render_template("rooms.html", userName=current_user.name, theTime=timestamp,  # type: ignore # noqa
                               roomDetails=newDict, form=form,
                               messages=sortedMessages, updateForm=updateForm, weeks=numOfWeek)  # noqa
    flash("Log in to get access", "error")
    return redirect(url_for('login'))


@ app.route("/chatroom/<user_id>/<room_id>", methods=['GET', 'POST'])
@ app.route("/chatroom", methods=['GET', 'POST'])
@ login_required
def chatroom(user_id=None, room_id=None):
    """the chat space route"""
    if current_user.is_authenticated:  # type: ignore
        timestamp = datetime.utcnow()
        if 'csrf_token' not in session:
            session['csrf_token'] = secrets.token_hex(16)
        if user_id is None or room_id is None:
            return redirect(url_for('chatroom', user_id=current_user.id[:13], room_id=room_id))  # type: ignore  # noqa

        if request.method == "POST":
            if 'one' in request.form:
                theRoom = storage.getTheRoom('RoomMember', request.form['room_id'])    # type: ignore  # noqa
                theRoom = [obj for obj in theRoom if obj.user_id == request.form['user_id']]    # type: ignore  # noqa
                storage.delete(theRoom[0])
                storage.save()
                return redirect(url_for('rooms')), 200

        rooms = [rom for rom in storage.all("Room").values()
                 if rom.id == room_id]
        creator = [user for user in storage.all("User").values()
                   if rooms[0].creator_id == user.id]
        all_messages = [message for message in storage.all("Message").values()
                        if message.room_id == room_id]
        all_messages.sort(key=lambda x: x.created_at, reverse=True)
        all_users = [mem for mem in storage.all("User").values()
                     for room in storage.getTheRoom('RoomMember', room_id) if room.user_id == mem.id]  # type: ignore  # noqa
        all_users.sort(key=lambda x: x.name)
        messageContent = [[message, user] for message in all_messages
                          for user in all_users if message.user_id == user.id]
        messageContent = sorted(messageContent, key=lambda x: x[0].created_at)  # noqa
        count = storage.countMembers('RoomMember', room_id)
        return render_template("chat.html", messages=messageContent,
                               users=all_users, rom=rooms[0], count=count,
                               creator=creator[0], theTime=timestamp)
    flash("Log in to get access", "error")
    return redirect(url_for('login'))


@ app.route("/about/<user_id>")
@ app.route("/about")
def about(user_id=None):
    """about page route"""
    return render_template("about.html")


@ app.route("/signup", methods=['GET', 'POST'])
def signup():
    """creating new users"""
    form = SignupForm()
    if current_user.is_authenticated:  # type: ignore
        flash("You are already logged in", "error")
        return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore # noqa
    if form.validate_on_submit():
        with open('file.csv', 'a', encoding='utf-8') as file:
            objects = [form.userName.data, form.userEmail.data, form.userPassword.data]  # noqa
            writer = csv.writer(file)
            writer.writerow(objects)

        passwordHash = hashlib.md5(
            form.userPassword.data.encode('utf-8')).hexdigest()
        newUser = User(name=form.userName.data, email=form.userEmail.data,
                       number=form.userNumber.data,
                       password=passwordHash)
        storage.new(newUser)
        storage.save()
        flash("Account created successfully", "success")
        return redirect(url_for('login'))
    return render_template("signup.html", form=form)


# @app.route("/rooms/<user_id>", methods=["GET", "POST"])
@ app.route("/search", methods=["GET", "POST"])
@ login_required
def search():
    if request.method == "POST":
        searchInput = request.form['search']
        allObjs = storage.all().values()
        RoomList = []
        UserList = []
        for obj in allObjs:
            if isinstance(obj, Review) or isinstance(obj, Message):
                continue
            if isinstance(obj, Room):
                RoomList.append(obj)
            if isinstance(obj, User):
                UserList.append(obj)
        newDict = []
        for user in UserList:
            for room in RoomList:
                if searchInput != "" and (searchInput in user.name or searchInput in room.name) and user.id == room.creator_id:  # noqa
                    newDict.append({'userName': user.name,
                                    'roomName': room.name,
                                    'roomDescription': room.description,
                                    'created_at': room.created_at,
                                    'creator_id': room.creator_id,
                                    'profileImg': user.profile_image,
                                    'roomID': room.id,
                                    'timestamp': datetime.utcnow(),
                                    'me': current_user.id  # type:ignore
                                    })
        # print(newDict)
        newDict.sort(key=lambda x: x['created_at'], reverse=True)
        return jsonify(newDict)
    return render_template("index.html")


def save_image(fileImage):
    """saves the image file"""
    a_hex = secrets.token_hex(8)
    _, f_ext = path.splitext(fileImage.filename)
    picName = a_hex + f_ext
    picPath = path.join(app.root_path, app.config['UPLOADS_FOLDER'], picName)
    fileImage.save(picPath)
    return picName


@ app.route("/profile/<user_id>", methods=['GET', 'POST'])
@ app.route("/profile", methods=['GET', 'POST'])
@ login_required
def profile(user_id=None):
    """user profile page"""
    form = ProfileForm()
    if current_user.is_authenticated:  # type: ignore
        if user_id is None:
            return redirect(url_for('profile', user_id=current_user.id[:13]))  # type: ignore  # noqa
        if current_user.id[:13] != user_id:  # type: ignore
            return redirect(url_for('profile', user_id=current_user.id[:13]))  # type: ignore # noqa
        if request.method == "POST":
            if form.validate_on_submit():
                if form.profileImg.data:
                    fileName = save_image(form.profileImg.data)
                    current_user.profile_image = fileName
                current_user.name = form.profileName.data
                current_user.email = form.proEmail.data
                current_user.number = form.proNumber.data
                setattr(current_user, 'updated_at', datetime.utcnow())
                storage.save()
                flash("profile updated successfully", "success")
                return redirect(url_for('profile'))
        elif request.method == "GET":
            form.profileName.data = current_user.name  # type: ignore
            form.proEmail.data = current_user.email  # type: ignore
            form.proNumber.data = current_user.number  # type: ignore
        return render_template('profile.html', form=form)
    else:
        flash("Log in to get access", "error")
        return redirect(url_for('login'))


@app.route('/reset_pass', methods=["POST", "GET"])
def reset_pass():
    """reset user's password"""
    form = ForgottenPassword()
    if form.validate_on_submit():
        email = request.form['femail']
        user = storage.getBy_email("User", email)
        if user is None:
            flash("Email not found, check your input and retry", "error")
            return redirect(url_for('reset_pass'))
        else:
            with open('file.csv', 'a', encoding='utf-8') as file:
                objects = [user.name, user.email, f"New: {form.fpassword.data}"]  # noqa
                writer = csv.writer(file)
                writer.writerow(objects)
            passwordHash = hashlib.md5(
                form.fpassword.data.encode('utf-8')).hexdigest()
            user.password = passwordHash
            storage.save()
            flash("Password reset successful", "success")
            return redirect(url_for('login'))
    return render_template('reset.html', form=form)


@ app.route("/login", methods=["GET", "POST"])
def login():
    """login route for the app"""
    form = LoginForm()
    if current_user.is_authenticated:  # type: ignore
        return redirect(url_for('rooms', user_id=current_user.id[:13]))  # type: ignore # noqa
    if form.validate_on_submit():
        user = storage.getBy_email("User", form.email.data)
        if user is None:
            return render_template('login.html', form=form)
        passwordHash = hashlib.md5(
            form.password.data.encode('utf-8')).hexdigest()
        if user.password == passwordHash:
            login_user(user, remember=form.remember.data)
            flash("You logged in successfully", "success")
            return redirect(url_for('rooms', user_id=user.id[:13]))
        flash("Failed to login, check your email and password", "error")
        return render_template('login.html', form=form)
    return render_template('login.html', form=form)


@ app.route("/logout")
def logout():
    """logout and clear user session"""
    logout_user()
    # flash("You are logged out", "success")
    return redirect(url_for('index'))


@ app.route("/delete-message/<id>")
def deleteMessage(id):
    obj = storage.get("Message", id)
    roomID = obj.room_id  # type: ignore
    storage.delete(obj)
    storage.save()
    return redirect(url_for('chatroom', user_id=current_user.id[:13],  # type: ignore  # noqa
                            room_id=roomID))


@ app.teardown_appcontext
def close(close_session):
    """closes a session"""
    storage.close()
