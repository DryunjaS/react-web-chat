import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../page/Auth";
import Chat from "../page/Chat";

const AppRouter = ()=>{
    return(
        <Routes>
            <Route path="/" element={<Auth/>}></Route>
            <Route path="/chat" element={<Chat/>}></Route>
        </Routes>
    )
}

export default AppRouter 