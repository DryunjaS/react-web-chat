import React, { useState } from 'react'
import { MyInput } from '../UI/MyInput'
import { MyButton } from '../UI/MyButton'

export const AddRoom = ({usedChats,enterAddChat,cancleAddChat}) => {
  const [input,setInput] = useState('')
  const returnFun = ()=>{
    const found = usedChats.find(
      (chat) => chat.toLowerCase().trim() === input.toLowerCase().trim()
    )
    if(input && !found){
      enterAddChat(input)
    }
    
  }
  return (
    <div className="wrapper-chat">
     <div className="wrap-newChat">
        <h3 className="list-title">Добавить новый чат</h3>      
        <div className="El-newChat">
            <MyInput value={input} onChange={(e)=>{setInput(e.target.value)}}/>
            <MyButton onClick={returnFun}>Создать</MyButton>
            <button 
                className='cancle-addChat'
                onClick={()=>cancleAddChat(false)}>Отмена</button>
       </div>
     </div>
    </div>
    
  )
}
