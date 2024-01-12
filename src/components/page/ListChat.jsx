import React from 'react'

export const ListChat = ({chats,thisChat,onChat,addChat}) => {

  return (
    <div className="list-wrap">
        <h3 className="list-title">Чаты</h3>      
        <div className="list-users">
            {chats.map((item, index) => (
                <ul key={index}>
                  <li 
                      className={item === thisChat ? 'li-chat-my' : 'li-chat'}
                      onClick={()=>{onChat(item)}}
                  >{item}</li>
                </ul>
            ))}
            <button className='add-chat' onClick={()=>addChat(true)}>+</button>
       </div>
    </div>
  )
}
