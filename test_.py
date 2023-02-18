from datetime import datetime

from models import storage

# rooms = storage.getTheRoom('RoomMember', 'a777d729-13c5-43fe-a250-eac93458e332')
# mems = [mem for mem in storage.all("User").values()
#         for room in storage.getTheRoom('RoomMember', 'a777d729-13c5-43fe-a250-eac93458e332') if room.user_id == mem.id]
# print(mems[0])
# for room in rooms:
#     print(room)
# print(rooms)
# theRoom = storage.getTheRoom('RoomMember', "a777d729-13c5-43fe-a250-eac93458e332")
# theRoom = [obj.__str__() for obj in theRoom if obj.user_id == "61ebd82e-0c17-45af-a4d1-0eab1e8a4457"]
# print(theRoom)
# num = storage.countMembers('RoomMember', "a777d729-13c5-43fe-a250-eac93458e332")
# print(num)
# user = storage.getBy_userID('RoomMember', '61ebd82e-0c17-45af-a4d1-0eab1e8a4457')
# print([user.id, user.room_id, user.user_id])
# memberObj = storage.getBy_userID_roomID(
#     'RoomMember', "61ebd82e-0c17-45af-a4d1-0eab1e8a4457", "93b2e966-25f8-46de-80b8-40aa69e2d392")
# print(memberObj)
# if memberObj and memberObj.room_id == "861887da-b6d2-4df9-890f-257e56af87d1" and memberObj.user_id == "61ebd82e-0c17-45af-a4d1-0eab1e8a4457":
#     print(True)
# else:
#     print(False)

now = datetime.utcnow()
theRoom = storage.get("Room", "58217000-1dcb-4821-8ddb-0b65e443b4aa")
# print((now - theRoom.created_at).days // 7)
# print(f"this_month: {now.month}\ncreated_month: {theRoom.created_at.month}")
# print((theRoom.created_at.year - now.year) * 12 + (theRoom.created_at.month - now.month))
print(theRoom.created_at.date() == now.date())
# print(f"Today: {now.date()}")
# print(f"Created_at: {theRoom.created_at.date()}")
# print(theRoom.created_at.strftime("%I:%M %p"))
# numsOfMonth = (now.year - theRoom.created_at.year) * 12 + (now.weeks - theRoom.created_at.weeks)
# print(numsOfMonth)
