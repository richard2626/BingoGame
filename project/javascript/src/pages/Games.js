import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Messages from "../components/game/messages";
import Notification from "../components/game/notification"

import { useSelector, useDispatch } from "react-redux";
import { updateBingoList, updateGameMode, updateMyTurn, updateName, updateTableSorted } from "../redux/actions";
import { store } from "../redux/store"

export default function Games(props) {
    const [number, setNumber] = useState(1);
    const [theme, setTheme] = useState("bg-indigo-200 hover:bg-indigo-300")
    const [mode, setMode] = useState(useSelector(state => state.profile.gamemode))
    const [myTurn, setMyTurn] = useState(useSelector(state => state.profile.myTurn))
    const [bingoSelected, setBingoSelected] = useState(useSelector(state => state.profile.bingoSelected))
    const [bingoList, setBingoList] = useState(useSelector(state => state.profile.bingoList))
    const [tablesorted, setTablesorted] = useState(useSelector(state => state.profile.tablesorted))
    const dispatch = useDispatch()
    

   


    //賓果盤被按下後
    const handleButtonClicked = (event) => {
        switch (mode) {
            case "picking":
                //setBingoList(bingoList[event.target.value] = number)
                // console.log(bingoList)
                // let array = bingoList
                // array[event.target.value] = number
                // dispatch(updateBingoList({
                //     bingoList: array
                // }))
                // setNumber(number + 1)
                break;
            case "gaming":
                console.log("before handle")
                props["pack"]["setButtonValue"](bingoList[event.target.value])
                console.log("after handle")
                break;
            case "erase":
                break;
        }
    }

    //確認排版
    const confirmTable = async () => {
        // const result = await Swal.fire({
        //     icon: "info",
        //     showDenyButton: true,
        //     denyButtonText: `等等我要修改`,
        //     title: "確定排版嗎",
        // })
        // if (result.isConfirmed) {
        //     Swal.fire("Saved!", "", "success")
        //     dispatch(updateGameMode({
        //         "gamemode": "gaming"
        //     }))
        //     setTheme("bg-neutral-50")
        // } else if (result.isDenied) {
        //     Swal.fire("進入修改模式", "", "info")
        //     dispatch(updateGameMode({
        //         "gamemode": "changing"
        //     }))
        //     setTheme("bg-neutral-50")
        // }
        dispatch(updateGameMode({
            "gamemode": "gaming"
        }))
        setTheme("bg-neutral-50")
    }

    // set name when window is ready
    useEffect(() => {
        setName()
    }, [])

    store.subscribe(() => {
        setBingoList(store.getState().profile.bingoList)
        setMode(store.getState().profile.gamemode)
        setMyTurn(store.getState().profile.myTurn)
        setBingoSelected(store.getState().profile.bingoSelected)
    })

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
                dispatch(updateName(
                    { name: name }
                ))
                console.log(store.getState().profile.name)
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

        dispatch(updateBingoList({
            bingoList: bingo_temp
        }))
        dispatch(updateTableSorted({
            tableSorted: true
        }))
        setNumber(26)
    }
    //重置遊戲
    const reset = () => {
        dispatch(updateGameMode({
            "gamemode": "reset"
        }))
    }
    const originalTheme = "w-12 h-12 rounded-md border-2 border-solid border-gray-400 font-bold text-lg "
    const buttonStyles = {
        default:   "bg-indigo-200 hover:bg-indigo-300 hover:text-white text-black ",
        disabled: "cursor-not-allowed  bg-indigo-300 text-zinc-100 ",
        selected: "cursor-not-allowed bg-indigo-200 text-white",
        waitforselect: "bg-indigo-50 hover:bg-indigo-300 hover:text-white text-black text-red-400 "
    };
    
    return (
        <div className="flex flex-col bg-indigo-50 text-center w-full space-y-2 pt-10 ">
            <div className="flex flex-row bg-indigo-100 text-center w-full h-600 justify-center" >
                <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
                    <Messages pack={props["pack"]} />
                </div>
                {/*賓果盤*/}
                <div className="flow-root">
                    <div className="bg-slate-300  w-80 h-80 text-center grid grid-cols-5 justify-right pl-3 pt-3 " id="bingoTable">
                        {/* 賓果按鈕 */}
                        {/* {bingoList.map((item, index) => (
                            <button className={`${theme} text-red-300 hover:text-indigo-300 w-12 h-12 rounded-md border-2 border-solid border-gray-500 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-zinc-100  text-lg font-bold`}
                                value={index}
                                onClick={handleButtonClicked}
                                disabled={!((mode === "picking" && bingoList[index] == false) || (mode === "gaming" && myTurn))|| (bingoSelected[parseInt((index)/5)][((index)%5)] == 0)||(mode === "finished")}
                                key={`${index}`}>{item}</button>

                        ))} */}
                        {bingoList.map((item, index) => {
                            const isSelected = bingoSelected[parseInt(index / 5)][index % 5] === 0;
                            const isDisabled = mode === "picking" || ((mode === "gaming"&&!myTurn)&&!isSelected)|| (mode === "finished")
                            let buttonTheme = buttonStyles.default;
                            // console.log("isSelected:",  index," ",isSelected)
                            // console.log("isDisabled",index," ", isDisabled)

                            if(isSelected){
                                buttonTheme = buttonStyles.selected;
                               
                            }else if(isDisabled){
                                buttonTheme = buttonStyles.disabled;
                            }else if(myTurn){
                                buttonTheme = buttonStyles.waitforselect;
                            }else{
                                buttonTheme = buttonStyles.default;
                            }                          
                            return(
                                <button 
                                    className={`${originalTheme}${buttonTheme}`}
                                    value={index}
                                    onClick={handleButtonClicked}
                                    disabled={isSelected||isDisabled}
                                    key={index}>
                                    {item}
                                </button>
                            );
                        })}

                    </div>
                </div>
                <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
                    <Notification pack={{ ...props["pack"], number: number, confirmTable: confirmTable, randomSort: randomSort ,reset: reset}} />
                </div>
            </div>
            <div className="flex flex-row h-60 bg-ingdigo-100 w-full justify-center">
                <div className="flex flex-row block md:hidden bg-red-100 py-2 px-1 w-80 h-full">
                    <div className="w-1/2 border-r border-indigo-500 px-1">
                        <Messages pack={props["pack"]} />
                    </div>
                    <div className="w-1/2 border-l border-indigo-500">
                        <Notification pack={{ ...props["pack"], number: number, confirmTable: confirmTable, randomSort: randomSort, reset: reset}} />
                    </div>
                </div>
            </div>
        </div>

    )
}