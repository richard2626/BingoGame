import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Messages from "../components/game/messages";
import Notification from "../components/game/notification"

export default function Games(props) {
    const [number, setNumber] = useState(1);
    const [theme, setTheme] = useState("bg-indigo-200 hover:bg-indigo-300")

    //賓果盤被按下後
    const handleButtonClicked = (event) => {
        switch (props["pack"]["mode"]) {
            case "picking":
                //setBingoList(bingoList[event.target.value] = number)
                console.log(props["pack"]["bingoList"])
                let array = props["pack"]["bingoList"]
                array[event.target.value] = number
                props["pack"]["setBingoList"](array)
                setNumber(number + 1)
                break;
            case "gaming":
                props["pack"]["setButtonValue"](props["pack"]["bingoList"][event.target.value])
                console.log(props["pack"]["checkBingoList"][event.target.value])
                break;
            case "erase":
                break;
        }
    }

    //確認排版
    const confirmTable = async () => {
        const result = await Swal.fire({
            icon: "info",
            showDenyButton: true,
            denyButtonText: `等等我要修改`,
            title: "確定排版嗎",
        })
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success")
            props["pack"]["setMode"]("gaming")
            setTheme("")
        } else if (result.isDenied) {
            Swal.fire("進入修改模式", "", "info")
            props["pack"]["setMode"]("changing")
            setTheme("")
        }
    }

    useEffect(() => {
        console.log(props.pack.messages)
    }, [props.pack.messages])

    // set name when window is ready
    useEffect(() => {
        setName()
    }, [])

    //輸入玩家名稱
    const setName = async () => {
        Swal.fire({
            title: "請輸入玩家名稱",
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
            },
            showCancelButton: false,
            confirmButtonText: "確定",
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: (name) => {
                props["pack"]["setUsername"](name)
            }
        })
    }
    //製作隨機賓果盤
    const randomSort = () => {
        let bingo_temp = Array(25)
        let i = 0
        for (i = 0; i < 25; ++i) {
            bingo_temp[i] = i + 1
        }

        bingo_temp.sort(() => (
            Math.random() - 0.5
        ))

        props["pack"]["setBingoList"](bingo_temp)
        props["pack"]["checkBingoList"] = bingo_temp
        setNumber(26)
    }

    return (
        <div className="flex flex-col bg-indigo-50 text-center w-full space-y-2 pt-10 ">
            <div className="flex flex-row bg-indigo-100 text-center w-full h-600 justify-center" >
                <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
                    <Messages pack={props["pack"]} />
                </div>
                {/*賓果盤*/}
                <div className="bg-slate-300 w-80 h-80 text-center grid grid-cols-5 justify-center px-1" id="bingoTable">
                    {/* 賓果按鈕 */}
                    {props["pack"]["bingoList"].map((item, index) => (
                        <button className={`${theme} text-red-300 hover:text-indigo-300 w-12 h-12 rounded-md border-2 border-solid border-gray-500 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-zinc-100 text-lg font-bold`}
                            value={index}
                            onClick={handleButtonClicked}
                            disabled={!((props["pack"]["mode"] === "picking" && props["pack"]["bingoList"][index] == false) || (props["pack"]["mode"] === "gaming" && props["pack"]["myTurn"]))} 
                            key={`${index}`}>{item}</button>
                
                    ))}
                </div>
                <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
                    <Notification pack={{ ...props["pack"], number: number, confirmTable: confirmTable, randomSort: randomSort }} />
                </div>
            </div>
            <div className="flex flex-row h-40 bg-ingdigo-100 w-full justify-center">
                <div className="flex flex-row block md:hidden bg-red-100 py-2 px-1 w-80 h-full">
                    <div className="w-1/2 border-r border-indigo-500 px-1">
                        <Messages pack={props["pack"]} />
                    </div>
                    <div className="w-1/2 border-l border-indigo-500">
                        <Notification pack={{ ...props["pack"], number: number, confirmTable: confirmTable, randomSort: randomSort }} />
                    </div>
                </div>
            </div>
        </div>

    )
}