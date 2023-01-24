import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const NavPage = () => {
  return (
    <>
    <Header/>
   <Outlet/>
   </>
  )
}

export default NavPage