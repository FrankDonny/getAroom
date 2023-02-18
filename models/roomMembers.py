#!/usr/bin/python3
"""User table module"""
from flask_login import UserMixin
from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from models.basemodel import Base, BaseModel


class RoomMember(BaseModel, Base, UserMixin):
    """User class"""
    __tablename__ = "roomMember"
    room_id = Column(String(60), ForeignKey("room.id"), nullable=False)
    user_id = Column(String(60), ForeignKey("user.id"), nullable=False)

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)
