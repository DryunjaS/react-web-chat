import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client"
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";

const socket = io.connect("http://localhost:5000")

const Chat = () =>{

    const {search} = useLocation()
    const [params,setParams] = useState(null)
    const [message,setMessage] = useState([])

    useEffect(()=>{
        const Search = Object.fromEntries(new URLSearchParams(search))
        setParams(Search)
        socket.emit('join',Search)
    },[search])
    useEffect(()=>{
        socket.on("message",(data)=>{
            setMessage((_message)=>[..._message,data])
        })
    },[])
    console.log('message',message)
    return(
        <div className="container">
            <div className="window">
                <div className="header">
                    <div className="title">Основной чат</div>
                    <div className="count-user">2 уч. в сети</div>
                </div>
                <div className="main">
                    
                </div>
                <form className="footer">
                    <MyInput
                        placeholder="Введите ваше сообщение..."
                    />
                    <MyButton>Отправить</MyButton>
                </form>
            </div>
        </div>
    )
}

export default Chat