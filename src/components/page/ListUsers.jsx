import React from 'react';

export const ListUsers = ({ list }) => {
  return (
    <div className="list-wrap">
        <h3 className="list-title">Список пользователейы</h3>      
        <div className="list-users">
            {list.map((item, index) => (
                <ul key={index}>
                <li>{item}</li>
                </ul>
            ))}
       </div>
    </div>
  ) 
};
