import React, { useEffect, useCallback, useState, useMemo, memo } from "react";
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";
import { useNavigate } from "react-router-dom";

import io from 'socket.io-client';
const socket = io('http://localhost:5000/');

const Auth = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const addUser = useCallback((e) => {
        e.preventDefault();
        if (!username) {
            return;
        }
        socket.emit('login', username.trim());

        socket.on('navigate', (data) => {
            if (data.status === "OK") {
                navigate(`/chat?name=${username}`);
            } else {
                console.log('NO');
            }
        });
    },[])

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
                <MyButton type='Submit' onClick={addUser}>Войти</MyButton>
            </form>
        </div>
    )
}

export default Auth;

