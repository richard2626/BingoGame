export default function Notification(props) {
    return (
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">
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