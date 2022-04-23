const initialState = {
    uid: "undefined",
    name: "anonymous",
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
                uid: action.payload.name
            }
        default:
            return state;
    }
}