import hashlib

from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField, FileSize
from wtforms import (BooleanField, HiddenField, PasswordField, SearchField,
                     StringField, SubmitField)
from wtforms.validators import (Email, EqualTo, InputRequired, Length,
                                ValidationError)

from models import storage


class SignupForm(FlaskForm):
    """validates the signup forms"""
    userName = StringField(label="User Name", validators=[
        Length(min=2, max=60), InputRequired()])
    userEmail = StringField(label="Email Address", validators=[
        Email("Invalid Email"), InputRequired()])
    userNumber = StringField(label="Phone Number")
    userPassword = PasswordField(label="Password", validators=[
        Length(max=60), InputRequired()])
    userPassword2 = PasswordField(label="Confirm Password", validators=[
        EqualTo("userPassword",
                message="Passwords does not match"),
        InputRequired()])
    submit = SubmitField(label="SignUp")

    def validate_userName(self, userName):
        """validating the field"""
        if len(self.userName.data) < 2 or len(self.userName.data) > 60:
            raise ValidationError("Name must be between 2-60 long")

    def validate_userPassword2(self, userPassword2):
        """validating the field"""
        if self.userPassword2.data != self.userPassword.data:
            raise ValidationError("The password does not match")


class LoginForm(FlaskForm):
    """Login class for the app"""
    email = StringField(label="Email", validators=[Email("Invalid Email"),
                                                   InputRequired()])
    password = PasswordField(label="Password", validators=[InputRequired()])
    remember = BooleanField(label="Remember me")
    submit = SubmitField("Login")

    def validate_password(self, password):
        """validating the field"""
        user = storage.getBy_email("User", self.email.data)
        if user is not None:
            passwordHash = hashlib.md5(
                password.data.encode('utf-8')).hexdigest()
            if user.password != passwordHash:  # type: ignore
                raise ValidationError("Wrong Password")


class RoomForm(FlaskForm):
    """Login class for the app"""
    roomName = StringField(label="Room Name", validators=[Length(max=100),
                                                          InputRequired()])
    roomDescription = StringField(label="Description",
                                  validators=[Length(max=150), InputRequired()])  # noqa
    submit = SubmitField("Create")

    def validate_name(self, name):
        """validating the field"""
        room = storage.getBy_name("Room", name.data)
        if room:
            raise ValidationError("Room already exist")


class UpdateForm(FlaskForm):
    """Login class for the app"""
    roomNameToUpdate = StringField(label="Room Name to Update",
                                   validators=[Length(max=100),
                                               InputRequired()])
    updateName = StringField(label="Room Name", validators=[Length(max=100),
                                                            InputRequired()])
    updateDescription = StringField(label="Description",
                                    validators=[Length(max=150), InputRequired()])  # noqa
    updateSubmit = SubmitField("update")


class ProfileForm(FlaskForm):
    """The profile form class"""
    csrf_token = HiddenField('csrf_token')
    profileImg = FileField('upload File',
                           validators=[FileAllowed(['jpg', 'png']),
                                       FileSize(2048*1024)])
    profileName = StringField(label='Update User Name',
                              validators=[Length(min=2, max=60)])
    proEmail = StringField(label='Update Email',
                           validators=[Email('Invalid Email')])
    proNumber = StringField(label='Update Phone Number')
    proSubmit = SubmitField("Update")

    def validate_number(self, number):
        if len(number.data) > 15:
            raise ValidationError("Number too long")
