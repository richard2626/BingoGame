import { useState } from "react"

export default function Games() {
    const [number, setNumber] = useState("none");
    const array = new Array(25)
    const [bingoList, setBingoList] = useState(array.fill(0, 0, 25));

    return (
        <div className="bg-indigo-50 text-center w-full h-400 space-y-2">
            <div className="h-11 w-full">none</div>
            <div className="bg-indigo-50 text-center w-full h-600 container mx">
                <div className="bg-slate-300 w-80 h-80  pt-10 text-center container mx-auto px-10">
                    {/* bingo buttons */}
                    {bingoList.map((item, index) => (
                        <button className=" bg-indigo-200 w-12 h-12 text-amber-600 rounded-md border-2 border-solid border-gray-500 hover:bg-indigo-300"
                            value={index}>{item}</button>
                    ))}

                </div>
                <div className="bg-slate-200 w-10 h-80 object-right">1</div>
            </div>
        </div>

    )
}