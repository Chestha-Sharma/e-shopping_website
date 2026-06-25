import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Store } from '../store';

export default function Adminroute({children}) {
    const {Store} = useContext(Store);
    const {userInfo} = Store;
  return (
   userInfo &&userInfo.isAdmin ?
   children 
   : 
   <Navigate to='/signin'/>
  )
}
