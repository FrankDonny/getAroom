#!/usr/bin/python3
from app_pack import app , send, socketio, join_room, leave_room

from models import storage
from models.messages import Message


@socketio.on('message')
def message(data):
    text = Message(text=data['text'], user_id=data['user_id'],
                   room_id=data['room_id'])
    storage.new(text)
    storage.save()
    data['messageID'] = text.id
    send(data, broadcast=True)


@socketio.on('join')
def join(data):
    room = storage.get("Room", data['room_id'])
    join_room(room)
    send({"msg": f"{data['name']} Left"}, room=room)


@socketio.on('leave')
def leave(data):
    pass


if __name__ == '__main__':
    # app.run(port=5000)
    socketio.run(app, debug=True)