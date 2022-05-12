import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { store } from "../../redux/store"

export default function Controlpanel(props) {
    const [mode, setMode] = useState(useSelector(state => state.profile.gamemode))
    const [username, setUsername] = useState(useSelector(state => state.profile.name))
    const [online, setOnline] = useState(useSelector(state => state.profile.online))

    store.subscribe(() => {
        setUsername(store.getState().profile.name)
        setOnline(store.getState().profile.online)
        setMode(store.getState().profile.gamemode)
    })

    
    return(
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">

                暱稱：{username}<br />
                目前在線：{online} <br />
                模式：{mode}<br />
            </div>
        </div>
    )
}