import asyncio
import json
from operator import le
import websockets

# 名字:websockets
USERS = {}
USERSPOINT = {}
PORT = 1234
preparednum = 0
online_people = 0
cnt_number = 1


async def chat(websocket, path):
    # 握手
    await websocket.send(json.dumps({"type": "handshake"}))

    async for message in websocket:
        global cnt_number
        data = json.loads(message)
        # print(data)
        message = ''
        # send messages
        if data["type"] == 'send':
            name = 'undefined'
            for k, v in USERS.items():
                if v["ws"] == websocket:
                    name = v["name"]
            if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
                message = {"type": "user",
                           "content": data["content"],
                           "from": name,
                           }

        # 玩家發送條數
        elif data["type"] == 'sendpoint':
            print("sendpoint")
        # 玩家準備完成
        elif data["type"] == 'prepared':
            preparednum = preparednum + 1
            message = {"type": "preparenum",
                       "content": {preparednum},
                       "user_list": list(USERS.keys()),
                       }

        # 玩家勝利
        #

        # 玩家登入
        elif data["type"] == 'login':
            temp_name = "anonymous{number}".format(number=cnt_number)
            cnt_number += 1
            USERS[data["content"]] = {"ws": websocket, "name": temp_name}

            if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
                message = {"type": "login",
                           "content": data["content"],
                           "user_list": [v["name"] for k, v in USERS.items()],
                           }

        # 玩家退出
        elif data["type"] == 'logout':
            del USERS[data["content"]]
            if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
                message = {"type": "logout",
                           "content": data["content"],
                           "user_list": list(USERS.keys()),
                           }

        # 群發

        await asyncio.wait(group_send(message))


def group_send(message):
    message["online"] = len(USERS)
    task = []
    users_to_delete = []
    for key, value in USERS.items():
        # key is user UUID, value is user websocket
        try:
            task.append(value["ws"].send(json.dumps(message)))
        except:
            users_to_delete.append(key)
    # delete unsed user's websocket
    for key in users_to_delete:
        del USERS[key]
    # print(task)
    return task


start_server = websockets.serve(chat, "127.0.0.1", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
