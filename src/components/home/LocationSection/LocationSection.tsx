import React from 'react';
import * as s from './LocationSection.styles';
import { useTranslation } from 'react-i18next';

export const LocationSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <s.LocationWrapper style={{ backgroundColor: '#27272A' }}>
      <s.SectionTitle>{t('homePage.locationSection.title')}</s.SectionTitle>
      <s.LocationGrid>
        <s.LocationCard>
          <s.LocationImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/507b11582ec9333d0092b0e2986a4db05d9ec276c1232f148acd0b9622ac7cfe?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
            alt="Ho Chi Minh City"
          />
          <s.LocationName>
            {t('homePage.locationSection.locations.hcm')}
          </s.LocationName>
        </s.LocationCard>

        <s.LocationCard>
          <s.LocationImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/849a1de26c43db87cd3fd5693bf5aa4ae4ae6530fb5079fc1b52fd24df5dddda?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
            alt="Hanoi"
          />
          <s.LocationName>
            {t('homePage.locationSection.locations.hanoi')}
          </s.LocationName>
        </s.LocationCard>

        <s.LocationCard>
          <s.LocationImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e142186995c3f23fea6c6ee4b7c0eabafda58468bbd55c54d37e2c90a363e59?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
            alt="Da Lat"
          />
          <s.LocationName>
            {t('homePage.locationSection.locations.dalat')}
          </s.LocationName>
        </s.LocationCard>

        <s.LocationCard>
          <s.LocationImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b80d9364de56edc70bbc0954171d7bc0c7a04b4190739a180fe0f33616cae7f?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
            alt="Other Locations"
          />
          <s.LocationName>
            {t('homePage.locationSection.locations.other')}
          </s.LocationName>
        </s.LocationCard>
      </s.LocationGrid>
    </s.LocationWrapper>
  );
};
