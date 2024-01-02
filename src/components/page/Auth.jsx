import React, { useState } from "react";
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";
import { Link } from "react-router-dom";

const Auth = () =>{
    const [username,setUsername] = useState("")

    return(
        <div className="container">
            <form className="Auth-form">
                <h3>Для входа в чат:</h3>
                <MyInput
                    placeholder="Введите ваше имя..."
                    type = "text"
                    name = "name"
                    value = {username}
                    onChange = {(e)=>{setUsername(e.target.value)}}
                    autoComplete = "off"
                />
                <Link to={`/chat?name=${username}`}>
                    <MyButton onClick={(e)=>{if(!username) e.preventDefault()}}>Войти</MyButton>
                </Link>
            </form>
        </div>
    )
}

export default Auth