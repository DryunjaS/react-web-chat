import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client"
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";
import { ListUsers } from "./ListUsers";
import { Mess } from "./Mess";

const socket = io.connect("http://localhost:5000/")

const Chat = () =>{

    const {search} = useLocation()
    const [thisUser,setThisUser] = useState('')
    const [users,setUsers] = useState([])
    const [message,setMessage] = useState([])
    const [input,setInput] = useState('')

    useEffect(() => {
        const Search = Object.fromEntries(new URLSearchParams(search));
        const currentUserName = Search.name; 
      
        setThisUser(currentUserName);
        socket.emit('new_chat', currentUserName);
      
        socket.on('users_arr', ({ users_arr }) => {
          setUsers(users_arr);
        });

        socket.on("new message", (data) => {
            setMessage((_message) => [..._message, data]);
        });
      }, [users]);

    const inputMes = (e)=>{
        e.preventDefault();
        console.log('message')
        if(input){
            socket.emit('message',{
                mess:input,
                name:thisUser
            })
            setInput('')
        }
    }
    return(
        <div className="container">
            <div className="window">
                <div className="header">
                    <h3 className="title">Основной чат</h3>
                </div>
                <div className="main">
                    <Mess message={message} User={thisUser}/>
                </div>
                <form className="footer">
                    <MyInput
                        placeholder="Введите ваше сообщение..."
                        value = {input}
                        onChange = {(e)=>setInput(e.target.value)}
                    />
                    <MyButton onClick={inputMes}>Отправить</MyButton>
                </form>
            </div>
            <ListUsers list={users}/>
        </div>
    )
}

export default Chat