import React, { useState } from "react";
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";
import { useNavigate } from "react-router-dom";

import io from 'socket.io-client';
const socket = io('http://localhost:5000'); 

const Auth = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const addUser = (e) => {
        e.preventDefault();
        if (!username) {
            return;
        }
        socket.emit('login', username);
        console.log('username',username)
    }

    socket.on('login', (data) => {
        if (data.status === "OK") {
            console.log('OK?','OK')
            navigate(`/chat?name=${username}`);
        }
        console.log('OK?','NO')
    });

    return (
        <div className="container">
            <form className="Auth-form">
                <h3>Для входа в чат:</h3>
                <MyInput
                    placeholder="Введите ваше имя..."
                    type="text"
                    name="name"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                    autoComplete="off"
                />
                <MyButton onClick={addUser}>Войти</MyButton>
            </form>
        </div>
    )
}

export default Auth;
