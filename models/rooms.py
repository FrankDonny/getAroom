#!/usr/bin/python3
"""messages table module"""
from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from models.basemodel import Base, BaseModel


class Room(BaseModel, Base):
    """room class"""
    __tablename__ = "room"
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(150), nullable=False)
    creator_id = Column(String(60), ForeignKey("user.id"), nullable=False)
    messages = relationship("Message", backref="room",
                            cascade="all, delete, delete-orphan")
    user = relationship("User", secondary="roomMember",
                        back_populates="room")

    def __init__(self, *args, **kwargs):
        """initializes room"""
        super().__init__(*args, **kwargs)
