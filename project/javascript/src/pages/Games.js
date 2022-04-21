import { useState } from "react"
import Swal from "sweetalert2"

export default function Games() {
    const [number, setNumber] = useState(1);
    const [mode, setMode] = useState("picking") // ["picking"|"gaming"|"changing"]
    const array = new Array(25)
    const [bingoList, setBingoList] = useState(array.fill(0, 0, 25));

    const handleButtonClicked = (event) => {
        switch (mode) {
            case "picking":
                //setBingoList(bingoList[event.target.value] = number)
                console.log(event.target.value)
                let array = bingoList
                array[event.target.value] = number
                setBingoList(array)
                setNumber(number + 1)

                break;
            case "gaming":
                break;
            case "erase":
                break;
        }
    }

    const confirmTable = async () => {
        const result = await Swal.fire({
            icon: "info",
            showDenyButton: true,
            denyButtonText: `等等我要修改`,
            title: "確定排版嗎",
        })
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success")
            setMode("gaming")
        } else if (result.isDenied) {
            Swal.fire("進入修改模式", "", "info")
            setMode("changing")
        }
    }

    return (
        <div className="bg-indigo-50 text-center w-full h-400 space-y-2">
            <div className="h-11 w-full"></div>

            <div className="flex flex-row bg-indigo-100 text-center w-full h-600 justify-center" >
                <div className="w-1/5 bg-red-100" id="notificationBar">
                    Hello
                </div>
                <div className="bg-slate-300 w-80 h-80  ml-1 mr-1 text-center content-center px-auto grid grid-cols-5 gap-3" id="bingoTable">
                    {/* bingo buttons */}
                    {bingoList.map((item, index) => (
                        <button className="bg-indigo-200 w-12 h-12 text-amber-600 rounded-md border-2 border-solid border-gray-500  hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-neutral-50 text-lg font-bold "
                            value={index} onClick={handleButtonClicked} disabled={(mode === "picking"&& bingoList[index] !== 0)}>{item}</button>
                    ))}
                </div>
                <div className="w-1/5 bg-red-100 flex flex-col justify-between py-2">
                    <div className="">
                        模式：{mode}<br />
                        <span hidden={number === 26}>現在選擇：{number}</span>
                    </div>

                    <div className="">
                        <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300"
                            hidden={!(number === 26 && (mode === "picking" || mode === "changing"))} onClick={confirmTable}>確定/修改排版</button>
                    </div>
                </div>
            </div>
        </div>

    )
}