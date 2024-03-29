import asyncio
import json
from operator import le
import websockets

# 名字:websockets
USERS = {}
USERSPOINT = {}
HOST = "0.0.0.0"
PORT = 1234

preparednum = 0
online_people = 0
cnt_number = 1
ingame = False
lefterror = ""
number_picked = []

"""

USERS = {
    uuid: {
        ws: websocket,
        name: name,
        ready: [true|false],
        table: [],
    },
    uuid2: {
        ...
    }
}

"""


# 接收APP傳來的資料 => 判斷情況回傳
async def chat(websocket, path):
    # 握手
    await websocket.send(json.dumps({"type": "handshake"}))

    async for message in websocket:
        global cnt_number
        global ingame
        
        global lefterror
        global number_picked
        data = json.loads(message)
        print("rec: ", data)
        message = {}
        # print(cnt_number)

        # 玩家互傳訊息
        if data["type"] == "send":
            name = "undefined"
            for k, v in USERS.items():
                if v["ws"] == websocket:
                    name = v["name"]
            if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
                message = {
                    "type": "user",
                    "content": data["content"],
                    "from": name,
                }
    

        # 玩家勝利（發送條數）
        elif data["type"] == "finish":
            name = "undefined"
            for k, v in USERS.items():
                if v["ws"] == websocket:
                    name = v["name"]
            print("someone won")
            ingame = False
            message = {"type": "finish", "content": "{name} 贏了!!".format(name=name)}

        # 玩家發送號碼 => 請下一個玩家發數字 =>
        elif data["type"] == "sendnumber":
            user_send = "undefined"
            received_num = data["content"]
            number_picked.append(received_num)
            user_uid = ""
            for k, v in USERS.items():
                if v["ws"] == websocket:
                    user_send = v["name"]
                    user_uid = k
                    break
            next = False
            next_player = list(USERS.keys())[0]
            for k, v in USERS.items():
                if next:
                    next_player = k
                    break
                if user_uid == k:
                    next = True

            message = {
                "type": "player_send_number",
                "content": "{user} chose {received_num}".format(
                    user=user_send, received_num=received_num
                ),
                "player": next_player,
                "picked_list": number_picked,
            }
        # 玩家準備完成
        elif data["type"] == "ready":
            username = "undefined"
            all_ready = True

            for k, v in USERS.items():
                if v["ws"] == websocket:
                    username = v["name"]
                    v["ready"] = True
                    v["table"] = data["content"]

            for k, v in USERS.items():
                if v["ready"] == False:
                    all_ready = False
                    break

            if all_ready:
                ingame = True
                message = {
                    "type": "system",
                    "content": "Game start!!!",
                    # tell the first person that it starts with him
                    "player": list(USERS.keys())[0],
                }
            else:
                message = {
                    "type": "system",
                    "content": "{user} is ready".format(user=username),
                }

        # 玩家登入
        elif data["type"] == "login":
            if ingame:
                await websocket.send(json.dumps({"type": "reject"}))
                return

            temp_name = "anonymous{number}".format(number=cnt_number)
            cnt_number += 1
            USERS[data["content"]] = {
                "ws": websocket,
                "name": temp_name,
                "ready": False,
            }

            if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
                message = {
                    "type": "login",
                    "content": temp_name,
                    "user_list": [v["name"] for k, v in USERS.items()],
                }

        # 玩家改名
        elif data["type"] == "update_name":
            original_name = ""
            for k, v in USERS.items():
                if v["ws"] == websocket:
                    original_name = v["name"]
                    v["name"] = data["content"]
            message = {
                "type": "change_name",
                "from": original_name,
                "to": data["content"],
            }
        elif data["type"] == "reset":
            ingame = False
            number_picked = []
            for k, v in USERS.items():
                v["ready"] = False
            message = {
                "type": "reset",
            }
        # 玩家退出
        # elif data["type"] == 'logout':
        #     del USERS[data["content"]]
        #     if len(USERS) != 0:  # asyncio.wait doesn't accept an empty list
        #         message = {"type": "logout",
        #                    "content": data["content"],
        #                    "user_list": list(USERS.keys()), }

        # 群發
        message["online"] = len(USERS)
        print("send: ", message)
        # 如果有人離開
        if lefterror != "":
            message_lefterror = {
                "type": "logout",
                "content": lefterror,
                "user_list": list(USERS.keys()),
            }
            tasks = [
                asyncio.create_task(
                    sending_message(message_lefterror, value["ws"], key)
                )
                for key, value in USERS.items()
            ]
            await asyncio.wait(tasks)
            lefterror = ""
            print("someoneleft")

        # await asyncio.wait([sending_message(message, value["ws"], key) for key, value in USERS.items()])

        tasks = [
            asyncio.create_task(sending_message(message, value["ws"], key))
            for key, value in USERS.items()
        ]
        await asyncio.wait(tasks)


async def sending_message(message, ws, key):
    global lefterror
    message["name"] = USERS[key]["name"]
    try:
        await ws.send(json.dumps(message))
    except:
        lefterror = USERS[key]["name"]
        del USERS[key]


# start_server = websockets.serve(chat, "192.168.0.244", PORT)



start_server = websockets.serve(chat, HOST, PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
