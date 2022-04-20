import {Link} from "react-router-dom"

export default function Nav(){
    return(
        <nav classname="flex flex-row justify-center space-x-3 ">
          <Link to="/games" className="bg-yellow-300 px-2 rounded-md hover:bg-yellow-400">
            開始遊戲
          </Link>
          <a href="#" onClick={(event) => { handleLogout(event) }}
            className="bg-yellow-300 hover:bg-yellow-400 rounded-md px-2"
          >Logout</a>
        </nav>
    )
}