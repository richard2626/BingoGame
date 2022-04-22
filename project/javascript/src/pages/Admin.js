import { useState, useEffect } from "react";

const Admin = (props) => {
  const [number, setNumber] = useState(18);

  useEffect(() => {

  }, []);

  return (
    <div
      className="adminpage"
      style="width: 100px; height: 600px; margin: 10px auto; text-align: center"
    >
      <h1>Bingo</h1>
      <div>{number}</div>
      <div style="width: 200px; border: 1px solid gray; height: 100px">
        <div style="width: 200px; height: 80px; float: mid; text-align: left">
          <p>
            <span>目前在線:{props.pack.online}</span>
          </p>
          <div id="user_list" style="height: 50px"></div>
        </div>
        <div
          id="msg_list"
          style="
            width: 400px;
            border: 1px solid gray;
            height: 300px;
            float: none;
          "
        ></div>
      </div>
      <br />
      <textarea
        id="msg_box"
        rows="7"
        cols="40"
        onkeydown={() => {
          confirm(event);
        }}
        style="margin-top: 300px"
      ></textarea>
      <br />
      <input
        type="button"
        value="發送"
        onSubmit={() => {
          send();
        }}
        style="width: 50px; height: 50px"
      />
    </div>
  );
};

export default Admin;



