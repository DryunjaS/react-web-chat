import React from 'react'

export const Mess = ({message,User}) => {
    return (
        <div>{message.map((mess, index) => (
            <ul 
                className="ul-mess"
                key={index}>
                <li className={User === mess.nick ? 'mess-li-my' : 'mess-li-other'}>
                    <div className={User === mess.nick ? 'mess-div-my' : 'mess-div-other'}>
                        <div className='mess-title'>{mess.nick}</div>
                        <div className='mess-text'>{mess.message}</div>
                        <div 
                            className={User === mess.nick ? 'mess-time-my' : 'mess-time-other'}>    {mess.time}</div>
                    </div>
                </li>
            </ul>
            ))}
        </div>
  )
}
