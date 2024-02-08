// Routes.tsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Chat from './components/page/Chat'

const MyRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Chat />} />
		</Routes>
	)
}

export default MyRoutes
