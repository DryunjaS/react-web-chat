import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import EmojiPicker from 'emoji-picker-react'
import { MyInput } from '../UI/MyInput'
import { MyButton } from '../UI/MyButton'
import { ListUsers } from './ListUsers'
import { Mess } from './Mess'
import Auth from './Auth'
import { ListChat } from './ListChat'
import { AddRoom } from './AddRoom'
import store from '../store/store'
import { observer } from 'mobx-react'

// const socket = io.connect('http://localhost:5000/')
const IP_ADRESS = '192.168.35.151'
const PORT = 8080
const socket = io.connect(`${IP_ADRESS}:${PORT}`)

const Chat = observer(() => {
	const [thisUser, setThisUser] = useState('')
	const [thisChat, setThisChat] = useState('Крутой')
	const [chats, setChats] = useState(['Основной', 'Крутой', 'Ровный'])
	const [usersArr, setUsersArr] = useState([])
	const [messagesArr, setMessagesArr] = useState([])
	const [message, setMessage] = useState('')
	const [isPickerVisible, setPickerVisible] = useState(false)
	const [isAddChat, setIsAddChat] = useState(false)

	const inputRef = useRef(null)
	useEffect(() => {
		if (sessionStorage.getItem('thisUser')) {
			setThisUser(sessionStorage.getItem('thisUser'))
			socket.emit('login', sessionStorage.getItem('thisUser'))
		} else {
			setThisUser('')
		}

		socket.on('message history', (history) => {
			setMessagesArr(history)
		})

		socket.on('users_arr', (data) => {
			console.log('data.users_arr', data.users_arr)
			setUsersArr(data.users_arr)
		})

		socket.on('new message', (data) => {
			setMessagesArr((_message) => [..._message, data])
		})
		socket.on('file uploaded', (data) => {
			console.log('File uploaded:', data)
			setMessagesArr((prevMessages) => [...prevMessages, data])
		})
		socket.on('chats new', (chats) => {
			console.log('chats new', chats)
			setChats(chats)
		})
		return () => {
			socket.off('chats new')
			socket.off('message history')
			socket.off('users_arr')
			socket.off('new message')
			socket.off('file uploaded')
		}
	}, [])

	const handleEmojiClick = ({ emoji }) => {
		setMessage((prevMessage) => {
			const newMessage = [...prevMessage, emoji].join('')
			return newMessage.replace(/,/g, '')
		})
	}
	const closePicker = () => {
		if (isPickerVisible) {
			setPickerVisible(false)
			inputRef.current.focus()
		}
	}
	const togglePicker = (e) => {
		e.preventDefault()
		setPickerVisible((prevVisible) => !prevVisible)
	}
	const inputMes = (e) => {
		e.preventDefault()
		console.log('message', {
			mess: message,
			name: thisUser,
			room: thisChat,
		})
		if (message) {
			socket.emit('message', {
				mess: message,
				name: thisUser,
				room: thisChat,
			})
			setMessage('')
		}
	}

	const handleRegister = (newUsername) => {
		sessionStorage.setItem('thisUser', newUsername)
		socket.emit('login', sessionStorage.getItem('thisUser'))
		socket.on('login', (data) => {
			if (data.status === 'FAILED') {
				sessionStorage.removeItem('thisUser')
			}
		})
	}

	const handleChat = (chat) => {
		setThisChat(chat)
	}
	const addChat = (val) => {
		setIsAddChat(val)
	}
	const cancleAddChat = (isChack) => {
		setIsAddChat(isChack)
	}
	const enterAddChat = (newChat) => {
		setChats((prevChats) => {
			const updatedChats = [...prevChats, newChat]
			socket.emit('chats new', updatedChats)
			return updatedChats
		})
		setIsAddChat(false)
	}

	//----------------------------
	useEffect(() => {
		socket.on('file-uploaded', (fileData) => {
			setMessagesArr((prevMessages) => [
				...prevMessages,
				{ ...fileData, isFile: true },
			])
		})
		return () => {
			socket.off('file-uploaded')
		}
	}, [socket, setMessagesArr])
	useEffect(() => {
		// Обработка истории файлов
		socket.on('file-history', (fileHistory) => {
			setMessagesArr((prevMessages) => [
				...prevMessages,
				...fileHistory.map((fileData) => ({ ...fileData, isFile: true })),
			])
		})

		return () => {
			socket.off('file-history')
		}
	}, [socket, setMessagesArr])

	const handleFileUpload = (e) => {
		const fileInput = document.getElementById('fileInput')
		const file = fileInput.files[0]

		if (!file) {
			return
		}

		const reader = new FileReader()

		reader.onloadend = () => {
			const fileData = reader.result // Теперь fileData - это ArrayBuffer

			socket.emit('file-upload', {
				fileData,
				fileType: file.type,
				fileName: file.name,
				nick: thisUser,
				room: thisChat,
			})
		}

		reader.readAsArrayBuffer(file)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			setPickerVisible(false) // Close the emoji picker when Enter is pressed
			inputMes(e)
		}
	}
	useEffect(() => {
		document.body.addEventListener('click', closePicker)

		return () => {
			document.body.removeEventListener('click', closePicker)
		}
	}, [])
	const baseServerUrl = `http://${IP_ADRESS}:${PORT}`

	useEffect(() => {
		const handleGlobalKeyPress = (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				setPickerVisible(false) // Закрыть выбор смайликов при нажатии клавиши Enter
				inputMes(e)
			}
		}
		document.addEventListener('keydown', handleGlobalKeyPress)

		return () => {
			document.removeEventListener('keydown', handleGlobalKeyPress)
		}
	}, [inputMes, setPickerVisible])

	return (
		<div>
			{!thisUser ? (
				<Auth onRegister={handleRegister} />
			) : (
				<div className='container' onClick={closePicker}>
					<div className='wrapper'>
						<ListChat
							chats={chats}
							thisChat={thisChat}
							onChat={handleChat}
							addChat={addChat}
						/>
						{isAddChat && (
							<AddRoom
								usedChats={chats}
								enterAddChat={enterAddChat}
								cancleAddChat={cancleAddChat}
							/>
						)}
						<div className='window'>
							<div className='header'>
								<h3 className='title'>{thisChat} чат</h3>
							</div>
							<div className='main'>
								<Mess
									message={messagesArr}
									User={sessionStorage.getItem('thisUser')}
									baseServerUrl={baseServerUrl}
									thisChat={thisChat}
								/>
							</div>
							<form className='footer' onClick={(e) => e.stopPropagation()}>
								<MyInput
									placeholder='Введите ваше сообщение...'
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									ref={inputRef}
									autoFocus={true} // Добавьте это свойство
								/>
								<button onClick={togglePicker} className='emoji-btn'>
									{!isPickerVisible ? (
										<img
											className='emoji-img'
											src={process.env.PUBLIC_URL + '/img/emoji.png'}
											alt='emoji'
										/>
									) : (
										<img
											className='emoji-img'
											src={process.env.PUBLIC_URL + '/img/krest.png'}
											alt='emoji'
										/>
									)}
								</button>
								{isPickerVisible && (
									<EmojiPicker
										className='EmojiPicker'
										onEmojiClick={handleEmojiClick}
										onClick={(e) => e.stopPropagation()}
										style={{
											position: 'absolute',
											bottom: '55px',
											right: '0',
											zIndex: '100',
										}}
									/>
								)}
								<label htmlFor='fileInput' className='fileInputLabel'>
									<img
										src={process.env.PUBLIC_URL + '/img/skrepcka.png'}
										alt='Attachment Icon'
										className='attachmentIcon'
									/>
									<input
										type='file'
										id='fileInput'
										onChange={handleFileUpload}
									/>
								</label>
								<MyButton onClick={inputMes}>Отправить</MyButton>
							</form>
						</div>
						<ListUsers list={usersArr} User={thisUser} />
					</div>
				</div>
			)}
		</div>
	)
})

export default Chat
