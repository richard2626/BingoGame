import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateMyTurn } from "../../redux/actions"
import { store } from "../../redux/store"

export default function Notification(props) {
    const [timeRemain, setTimeRemain] = useState(0)

    const [timeClass, setTimeClass] = useState("")
    const dispatch = useDispatch()

    const intervalRef = useRef()

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeRemain(prev => prev - 1)
        }, 1000)
        return () => clearInterval(intervalRef.current)
    }, [])

    const [myTurn, setMyturn] = useState(useSelector(state => state.profile.myTurn))
    const [username, setUsername] = useState(useSelector(state => state.profile.name))
    const [mode, setMode] = useState(useSelector(state => state.profile.gamemode))
    const [online, setOnline] = useState(useSelector(state => state.profile.online))
    const [point, setPoint] = useState(useSelector(state => state.profile.point))
    const [tableSorted, setTableSorted] = useState(useSelector(state => state.profile.tableSorted))
 
    store.subscribe(() => {
        setMyturn(store.getState().profile.myTurn)
        setUsername(store.getState().profile.name)
        setOnline(store.getState().profile.online)
        setMode(store.getState().profile.gamemode)
        setPoint(store.getState().profile.point)
        setTableSorted(store.getState().profile.tableSorted)
    })

    useEffect(() => {
        if (myTurn) {
            setTimeRemain(30)
        } else {
            setTimeRemain(0)
        }
    }, [myTurn])

    return (
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">
                暱稱：{username}<br />
                目前在線：{online} <br />
                模式：{mode}<br />
                條數(一條獲勝)：{point}<br />
                <span hidden={(myTurn)||!(mode==="gaming")}>等待其他玩家</span>
                <span hidden={!(myTurn)||!(mode==="gaming")}>輪到你了</span>
                <br />
                {/* <span hidden={props["pack"]["number"] === 26}>現在選擇：{props["pack"]["number"]}</span> */}
            </div>

            <div className="">
                <button className="bg-indigo-200 py-1 px-2 rounded-lg mr-2 mb-1 hover:bg-indigo-300 "
                    onClick={props["pack"]["randomSort"]} 
                    hidden={mode === "gaming" || mode === "finished"}>
                    隨機排序!!!</button>
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    // hidden={!(props["pack"]["number"] === 26 && (mode === "picking" || mode === "changing"))} 
                    hidden={!((mode === "picking" || mode === "changing")&&tableSorted)}
                    onClick={props["pack"]["confirmTable"]}>
                    確定排版</button>
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    onClick={props["pack"]["reset"]} 
                    hidden={mode !== "finished"}>
                    重新遊戲</button>
            </div>
        </div>
    )
}