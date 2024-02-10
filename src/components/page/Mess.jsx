import React, { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export const Mess = ({ message, User, baseServerUrl, thisChat }) => {
	const filteredMessages = message.filter((mess) => mess.room === thisChat)
	const messagesContainerRef = useRef(null)
	const [ref, inView] = useInView({
		triggerOnce: false,
	})

	useEffect(() => {
		if (inView) {
			messagesContainerRef.current?.lastElementChild?.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}, [inView, filteredMessages])

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
		</div>
	)
}
