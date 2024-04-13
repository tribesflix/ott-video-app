import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSelector } from 'react-redux';
import { selectUID } from '../../features/user/userSlice';

const ProtectedAdminRoute = ({ adminRoute, setAdminRoute }) => {

    const userId = useSelector(selectUID);

    useEffect(() => {
        const fetchData = async () => {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if(userDoc.exists()) {
            if(userDoc.data().type === "admin") {
              setAdminRoute(true);
            }
          }
        }
    
        fetchData();
      }, [])

    return (
        adminRoute ? <Dashboard /> : <Navigate to={'/home'} />
    )
}

export default ProtectedAdminRoute;