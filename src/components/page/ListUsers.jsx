import React from 'react'

export const ListUsers = ({ list, User }) => {
	return (
		<div className='list-wrap'>
			<h3 className='list-title'>Список пользователей</h3>
			<div className='list-users'>
				{list.sort().map((item, index) => (
					<ul key={index}>
						<li className={User === item ? 'my-name' : 'other-name'}>{item}</li>
					</ul>
				))}
			</div>
		</div>
	)
}
