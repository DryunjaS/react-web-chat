import React, { useState } from 'react'
import { MyInput } from '../UI/MyInput'
import { MyButton } from '../UI/MyButton'

export const AddRoom = ({enterAddChat,cancleAddChat}) => {
  const [input,setInput] = useState('')
  return (
    <div className="wrapper-chat">
     <div className="wrap-newChat">
        <h3 className="list-title">Добавить новый чат</h3>      
        <div className="El-newChat">
            <MyInput value={input} onChange={(e)=>{setInput(e.target.value)}}/>
            <MyButton onClick={()=>enterAddChat(input)}>Создать</MyButton>
            <button 
                className='cancle-addChat'
                onClick={()=>cancleAddChat(false)}>Отмена</button>
       </div>
     </div>
    </div>
    
  )
}
