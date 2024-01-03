import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client"
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";

const socket = io.connect("http://localhost:5000/")

const Chat = () =>{

    const {search} = useLocation()
    const [user,setUser] = useState('')
    const [message,setMessage] = useState([])
    const [input,setInput] = useState('')
    useEffect(()=>{
        const Search = Object.fromEntries(new URLSearchParams(search))
        setUser(Search.name)
    },[search])
    useEffect(()=>{
        socket.on("message",(data)=>{
            setMessage((_message)=>[..._message,data])
        })
    },[])

    const inputMes = ()=>{
        socket.emit('message',input)
        setInput('')
    }
    
    console.log('user',user)
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
                        value = {input}
                        onChange = {(e)=>setInput(e.target.value)}
                    />
                    <MyButton onClick={inputMes}>Отправить</MyButton>
                </form>
            </div>
        </div>
    )
}

export default Chat