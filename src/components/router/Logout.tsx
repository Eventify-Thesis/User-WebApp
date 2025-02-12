// @ts-nocheck 
// @ts-ignore 
import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(doLogout());
  }, [dispatch]);

  return <Navigate to="/" replace />;
};

export default Logout;
