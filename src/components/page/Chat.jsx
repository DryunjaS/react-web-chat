import React, { useEffect, useState } from "react";
import io from "socket.io-client"
import EmojiPicker from 'emoji-picker-react';
import { MyInput } from "../UI/MyInput";
import { MyButton } from "../UI/MyButton";
import { ListUsers } from "./ListUsers";
import { Mess } from "./Mess";
import Auth from "./Auth";

const socket = io.connect("http://localhost:5000/")

const Chat = () =>{

    const [thisUser,setThisUser] = useState('')
    const [usersArr,setUsersArr] = useState([])
    const [messagesArr,setMessagesArr] = useState([])
    const [message,setMessage] = useState('')
	const [registered, setRegistered] = useState(false)
    const [isPickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {   
        socket.on('message history', (history) => {
            setMessagesArr(history);
          });
        
        socket.on('users_arr', (data) => {
			setUsersArr(data.users_arr)
		})

        socket.on("new message", (data) => {
            setMessagesArr((_message) => [..._message, data]);
        });
        socket.on('file uploaded', (data) => {
            console.log('File uploaded:', data);
            setMessagesArr((prevMessages) => [...prevMessages, data]);
        });
        return () => {
            socket.off('message history');
			socket.off('users_arr')
			socket.off('new message')
            socket.off('file uploaded');
		}
      }, []);
      const handleEmojiClick = ({emoji})=>{
        setMessage((prevMessage) => {
            const newMessage = [...prevMessage, emoji].join('');
            return newMessage.replace(/,/g, '');
          });
          
      }
      const togglePicker = (e) => {
        e.preventDefault();
        setPickerVisible((prevVisible) => !prevVisible);
      };
      const inputMes = (e) => {
        e.preventDefault();
        if (message) {
          socket.emit('message', {
            mess: message,
            name: thisUser,
          });
          setMessage('');
        }
      };
      
      
    const handleRegister = (newUsername) => {      
        socket.emit('login', newUsername);
        setRegistered(true);
        setThisUser(newUsername);

        socket.on('login', (data) => {
          if (data.status === 'FAILED') {
            setRegistered(false);
            setThisUser('');
          }
        });
    };

      //----------------------------
    useEffect(() => {
        socket.on('file-uploaded', (fileData) => {
          setMessagesArr((prevMessages) => [
            ...prevMessages,
            { ...fileData, isFile: true },
          ]);
        });
        return () => {
          socket.off('file-uploaded');
        };
    }, [socket, setMessagesArr]);
    useEffect(() => {
        // Обработка истории файлов
        socket.on('file-history', (fileHistory) => {
            setMessagesArr((prevMessages) => [
                ...prevMessages,
                ...fileHistory.map((fileData) => ({ ...fileData, isFile: true })),
            ]);
        });
    
        return () => {
            socket.off('file-history');
        };
    }, [socket, setMessagesArr]);
    
    const handleFileUpload = (e) => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file) {
            return;
        }
    
        const reader = new FileReader();
    
        reader.onloadend = () => {
            const fileData = reader.result; // Теперь fileData - это ArrayBuffer
    
            socket.emit('file-upload', {
                fileData,
                fileType: file.type,
                fileName: file.name,
                nick: thisUser,
            });
        };
    
        reader.readAsArrayBuffer(file);
    };
    
       
    const baseServerUrl = 'http://localhost:5000'

    return(
        <div>
            {!registered ? (<Auth onRegister={handleRegister} />) 
            : (
            <div className="container">
                <div className="window">
                    <div className="header">
                        <h3 className="title">Основной чат</h3>
                    </div>
                    <div className="main">
                        <Mess message={messagesArr} User={thisUser} baseServerUrl={baseServerUrl}/>
                    </div>
                    <form className="footer">
                        <MyInput
                            placeholder="Введите ваше сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            onClick={togglePicker}
                            className="emoji-btn"
                        >
                        {
                            !isPickerVisible ? 
                            (<img className="emoji-img" src={process.env.PUBLIC_URL + '/img/emoji.png'} alt="emoji" />) :
                            (<img className="emoji-img" src={process.env.PUBLIC_URL + '/img/krest.png'} alt="emoji" />)
                        }
                        </button>
                        {isPickerVisible && 
                        <EmojiPicker 
                            className='EmojiPicker' 
                            onEmojiClick={handleEmojiClick} 
                        />}
                        <label htmlFor="fileInput" className="fileInputLabel">
                          <img src={process.env.PUBLIC_URL + "/img/skrepcka.png"} alt="Attachment Icon" className="attachmentIcon" />
                          <input type="file" id="fileInput" onChange={handleFileUpload} />
                        </label>
                        <MyButton onClick={inputMes}>Отправить</MyButton>
                    </form>

                </div>
                <ListUsers list={usersArr} User={thisUser}/>
            </div>
        )}
        </div>
        
    )
}

export default Chat