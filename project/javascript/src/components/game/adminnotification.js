import { useEffect } from "react"

export default function Adminnotification(props) {

    useEffect(() => {
        props["pack"]["setUsername"]("Admin")
    }, [])
    


    return(
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">
                暱稱：{props["pack"]["username"]}<br />
                目前在線：{props["pack"]["online"]} <br />
                模式：{props["pack"]["mode"]}<br />
            </div>

            {/*<div className="">
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    onClick={props["pack"]["randomSort"]} hidden={props["pack"]["mode"] === "gaming"}>結束遊戲</button>
            </div>*/}
            {/*<div className="">
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    onClick={props["pack"]["randomSort"]} hidden={props["pack"]["mode"] === "gaming"}>開始遊戲</button>
            </div>*/}
        </div>
    )
}