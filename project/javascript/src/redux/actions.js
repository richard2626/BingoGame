export const RESETPROFILE = "RESETPROFILE"
export const UPDATEUUID = "UPDATEUUID"
export const UPDATENAME = "UPDATENAME"

export const resetProfile = () => ({ type: RESETPROFILE })
export const updateUUID = () => ({ type: UPDATEUUID, payload: value })
export const updateName = () => ({ type: UPDATENAME, payload: value })