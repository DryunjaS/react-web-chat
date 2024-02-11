import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export const Mess = ({ message, User, baseServerUrl, thisChat }) => {
	const filteredMessages = message.filter((mess) => mess.room === thisChat)
	const messagesContainerRef = useRef(null)
	const [ref, inView] = useInView({
		triggerOnce: false,
	})
	const [lastMessageRef, setLastMessageRef] = useState(null)
	const [isBottom, setIsBottom] = useState(false)

	useEffect(() => {
		if (inView) {
			messagesContainerRef.current?.lastElementChild?.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}, [inView, filteredMessages])

	useEffect(() => {
		setIsBottom(filteredMessages.length > 0 && !inView)

		// Устанавливаем ref для предпоследнего элемента
		if (filteredMessages.length >= 2) {
			const lastMessageElement =
				messagesContainerRef.current.children[filteredMessages.length - 2]
			setLastMessageRef(lastMessageElement)
		}
	}, [inView, filteredMessages])

	const handleToBottom = () => {
		lastMessageRef?.scrollIntoView({
			behavior: 'smooth',
		})
	}

	return (
		<div ref={messagesContainerRef}>
			{filteredMessages.map((mess, index) => (
				<div
					key={index}
					ref={index === filteredMessages.length - 2 ? ref : null}
				>
					<ul className='ul-mess'>
						<li className={User === mess.nick ? 'mess-li-my' : 'mess-li-other'}>
							<div
								className={
									User === mess.nick ? 'mess-title-my' : 'mess-title-other'
								}
							>
								{User === mess.nick ? 'Вы' : `${mess.nick}`}
							</div>
							<div className={User === mess.nick ? 'mess-div-wrap' : ''}>
								<div
									className={
										User === mess.nick ? 'mess-div-my' : 'mess-div-other'
									}
								>
									{mess.isFile ? (
										mess.fileType.startsWith('image/') ? (
											<div>
												<img
													src={`${baseServerUrl}${mess.downloadLink}`}
													alt={mess.fileName}
													style={{ maxWidth: '200px', maxHeight: '200px' }}
												/>
												<br />
												<a
													href={`${baseServerUrl}${mess.downloadLink}`}
													download={mess.fileName}
													target='_blank'
													rel='noopener noreferrer'
												>
													Download Image
												</a>
											</div>
										) : (
											<div>
												<a
													href={`${baseServerUrl}${mess.downloadLink}`}
													download={mess.fileName}
													target='_blank'
													rel='noopener noreferrer'
												>
													{mess.fileName}
												</a>
											</div>
										)
									) : (
										<>
											<div className='mess-text'>{mess.message}</div>
											<div
												className={
													User === mess.nick
														? 'mess-time-my'
														: 'mess-time-other'
												}
											>
												{mess.time}
											</div>
										</>
									)}
								</div>
							</div>
						</li>
					</ul>
				</div>
			))}
			{isBottom && (
				<button className='btn-toBottom' onClick={handleToBottom}>
					⇩
				</button>
			)}
		</div>
	)
}
