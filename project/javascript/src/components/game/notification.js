import { useEffect, useState } from "react"

export default function Notification(props) {
    const [timeRemain,setTimeRemain] = useState(0)
    const [timeClass,setTimeClass] = useState("")

    useEffect(()=>{
        if(timeRemain > 0){
            setTimeout(()=>{
                timeRemain(timeRemain - 1)
            },1000)
        }else if(timeRemain === 0){
            props["pack"]["setNumberPicked"](0)
        }
    },[timeRemain])

    useEffect(()=>{
        if(props["pack"]["myTurn"]){
            setTimeRemain(30)
            setTimeClass("visible")
        }else{
            setTimeRemain(0)
            setTimeClass("invisible")
        }
    },[props["pack"]["myTurn"]])    

    return (
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">
                <div className={`${timeClass}`} id="countdown" >
                    TimeLeft: {timeRemain}
                </div>
                暱稱：{props["pack"]["username"]}<br />
                目前在線：{props["pack"]["online"]} <br />
                模式：{props["pack"]["mode"]}<br />
                <span hidden={props["pack"]["number"] === 26}>現在選擇：{props["pack"]["number"]}</span>
            </div>

            <div className="">
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    onClick={props["pack"]["randomSort"]} hidden={props["pack"]["mode"] === "gaming"}>隨機排序!!!</button>
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    hidden={!(props["pack"]["number"] === 26 && (props["pack"]["mode"] === "picking" || props["pack"]["mode"] === "changing"))} onClick={props["pack"]["confirmTable"]}>確定/修改排版</button>
            </div>
        </div>
    )
}