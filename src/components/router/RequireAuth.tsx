// @ts-nocheck
// @ts-ignore
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxHooks";
import { WithChildrenProps } from "@/types/generalTypes";
import Cookies from "js-cookie";

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = Cookies.get("access_token");
  console.log("children", children);
  return token ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
