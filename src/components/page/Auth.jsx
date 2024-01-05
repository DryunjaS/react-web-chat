import React, { useState } from "react";
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";

const Auth = ({onRegister}) => {
    const [username, setUsername] = useState("");
    const handleRegister = () => {
        if (username.trim() !== '') {
            onRegister(username.trim());
        }
      };
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
                <MyButton type='Submit' onClick={handleRegister}>Войти</MyButton>
            </form>
        </div>
    )
}

export default Auth;

