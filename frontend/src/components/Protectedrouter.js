import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Store } from '../store';

export default function Protectedroter({children}) {
    const {Store} = useContext(Store);
    const {userInfo} = Store;
  return (
   userInfo ?
   children 
   : 
   <Navigate to='/signin'/>
  )
}
