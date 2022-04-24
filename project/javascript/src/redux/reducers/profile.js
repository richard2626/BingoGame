const initialState = {
    uid: "undefined",
    name: "anonymous",
    bingoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bingoSelected: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    numberPicked: [],
    messages: [],
    online: 0,
    gamemode: "picking",
    myTurn: false,
}

export const profile = (state = initialState, action) => {
    switch (action["type"]) {
        case "RESTOREPROFILE":
            return initialState;
        case "UPDATEUUID":
            return {
                ...state,
                uid: action.payload.uid
            }
        case "UPDATENAME":
            return {
                ...state,
                name: action.payload.name
            }
        case "UPDATEBINGOLIST":
            return {
                ...state,
                bingoList: action.payload.bingoList
            }
        case "UPDATEBINGOSELECTED":
            let array = state["bingoSelected"]
            array[action.payload.bingoSelected] = true
            return {
                ...state,
                bingoSelected: array
            }
        case "UPDATENUMBERPICKED":
            return {
                ...state,
                numberPicked: [...state.numberPicked, action.payload.numberPicked]
            }
        case "UPDATEMESSAGES":
            return {
                ...state,
                messages: [...state.messages, action.payload.message]
            }
        case "UPDATEONLINEMEMBER":
            return {
                ...state,
                online: action.payload.online
            }
        case "UPDATEGAMEMODE":
            return {
                ...state,
                gamemode: action.payload.gamemode
            }
        case "UPDATEMYTURN":
            return {
                ...state,
                myTurn: action.payload.myTurn
            }
        default:
            return state;
    }
}