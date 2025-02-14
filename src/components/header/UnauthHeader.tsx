// @ts-nocheck
// @ts-ignore
import React from "react";
import { DesktopUnauthHeader } from "./layouts/DesktopUnauthHeader";
import { MobileUnauthHeader } from "./layouts/MobileUnauthHeader";
import { useResponsive } from "@/hooks/useResponsive";

interface UnauthHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  isTwoColumnsLayout: boolean;
}

export const UnauthHeader: React.FC<UnauthHeaderProps> = ({}) => {
  return <DesktopUnauthHeader />;
};
