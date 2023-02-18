#!/usr/bin/python3
"""User table module"""
from flask_login import UserMixin
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from models.basemodel import Base, BaseModel


class User(BaseModel, Base, UserMixin):
    """User class"""
    __tablename__ = "user"
    name = Column(String(60), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(60), nullable=False)
    number = Column(String(15))
    profile_image = Column(String(20), default='default.png', nullable=False)
    # rooms_created = relationship("Room", backref="user",
    #                              cascade="all, delete, delete-orphan")
    messages = relationship("Message", backref="user",
                            cascade="all, delete, delete-orphan")
    reviews = relationship("Review", backref="user",
                           cascade="all, delete, delete-orphan")
    room = relationship("Room", secondary="roomMember", back_populates="user")

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)
