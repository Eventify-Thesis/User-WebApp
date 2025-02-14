import React from "react";
import { ProfileDropdown } from "../components/profileDropdown/ProfileDropdown/ProfileDropdown";
import { SettingsDropdown } from "../components/settingsDropdown/SettingsDropdown";
import { HeaderFullscreen } from "../components/HeaderFullscreen/HeaderFullscreen";
import * as S from "../UnauthHeader.styles";
import { BaseRow } from "@/components/common/BaseRow/BaseRow";
import { BaseCol } from "@/components/common/BaseCol/BaseCol";
import { BaseButton } from "@/components/common/BaseButton/BaseButton";

interface DesktopUnauthHeaderProps {
  isTwoColumnsLayout: boolean;
}

export const DesktopUnauthHeader: React.FC<DesktopUnauthHeaderProps> = ({
  isTwoColumnsLayout,
}) => {
  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn xl={16} xxl={17}>
      <BaseRow justify="space-between">
        <BaseCol xl={15} xxl={12}>
          {/* <UnauthHeaderSearch /> */}
        </BaseCol>
      </BaseRow>
    </S.SearchColumn>
  ) : (
    <>
      <BaseCol lg={10} xxl={8}>
        {/* <UnauthHeaderSearch /> */}
      </BaseCol>
    </>
  );

  return (
    <BaseRow justify="space-between" align="middle">
      <S.NavLogo>
        <a href="/">Emploi</a>
      </S.NavLogo>

      <S.ProfileColumn xl={8} xxl={7} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <BaseRow align="middle" justify="end" gutter={[5, 5]}>
          <BaseCol>
            <BaseRow gutter={[{ xxl: 5 }, { xxl: 5 }]}>
              <BaseCol>
                <BaseButton type="link" href="auth/login">
                  Log in
                </BaseButton>
              </BaseCol>
              <BaseCol>
                <BaseButton type="link" href="auth/sign-up">
                  Sign Up
                </BaseButton>
              </BaseCol>
            </BaseRow>
          </BaseCol>

          <BaseCol>
            <ProfileDropdown />
          </BaseCol>
        </BaseRow>
      </S.ProfileColumn>
    </BaseRow>
  );
};
