import styled from "styled-components";

export const FooterWrapper = styled.footer`
  width: 100%;
  margin-top: 24px;
`;

export const MainFooter = styled.div`
  background-color: rgba(57, 63, 78, 1);
  padding: 76px 0;

  @media (max-width: 991px) {
    padding: 40px 20px;
  }
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 38% 39% 23%;
  gap: 20px;
  max-width: 1267px;
  margin: 0 auto;
  padding: 0 15px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterTitle = styled.h4`
  color: rgba(201, 201, 201, 1);
  font-size: 12px;
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 700;
  line-height: 2;
  margin-bottom: 15px;
`;

export const ContactColumn = styled.div``;

export const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  color: rgba(170, 170, 170, 1);
  font-size: 12px;
`;

export const ContactIcon = styled.img`
  width: 16px;
  aspect-ratio: 1;
  object-fit: contain;
`;

export const ContactText = styled.span`
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 400;
`;

export const PhoneNumber = styled.div`
  color: rgba(45, 194, 117, 1);
  font-size: 16px;
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  line-height: 1;
  margin-top: 13px;
`;

export const AddressText = styled.div`
  color: rgba(153, 153, 153, 1);
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 12px;
  font-weight: 400;
`;

export const LinksColumn = styled.div``;

export const FooterLink = styled.a`
  color: rgba(170, 170, 170, 1);
  font-size: 12px;
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 400;
  line-height: 2;
  text-decoration: none;
  display: block;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const NewsletterSection = styled.div`
  margin-top: 32px;
`;

export const NewsletterInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(130, 139, 160, 1);
  padding: 8px 10px;
  margin-top: 10px;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const EmailIcon = styled.img`
  width: 24px;
  aspect-ratio: 1;
  object-fit: contain;
`;

export const Input = styled.input`
  background: none;
  border: none;
  color: rgba(117, 117, 117, 1);
  font-family:
    Estonia,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: rgba(117, 117, 117, 1);
  }
`;

export const SubmitIcon = styled.img`
  width: 24px;
  aspect-ratio: 1;
  object-fit: contain;
  cursor: pointer;
`;

export const CompanyColumn = styled.div``;

export const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 29px 0;
`;

export const AppSection = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1167px;
  margin: 33px auto 0;
  padding: 0 15px;

  @media (max-width: 991px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const AppColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AppImage = styled.img`
  width: 150px;
  aspect-ratio: 3;
  object-fit: contain;
  margin-top: 7px;
`;

export const SocialColumn = styled.div``;

export const SocialIcons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const SocialIcon = styled.img`
  width: 24px;
  aspect-ratio: 0.77;
  object-fit: contain;
`;

export const LanguageSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const LanguageIcon = styled.img`
  width: 40px;
  aspect-ratio: 1;
  object-fit: contain;
  cursor: pointer;
`;

export const BottomFooter = styled.div`
  background-color: rgba(29, 29, 29, 1);
  padding: 55px 15px;
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 31% 69%;
  gap: 20px;
  max-width: 1275px;
  margin: 0 auto;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

export const LogoColumn = styled.div``;

export const FooterLogo = styled.img`
  width: 127px;
  aspect-ratio: 3.1;
  object-fit: contain;
`;

export const CompanyInfo = styled.div`
  color: rgba(179, 179, 179, 1);
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  line-height: 20px;
  margin-top: 20px;
`;

export const InfoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 991px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const CompanyDetails = styled.div`
  color: rgba(179, 179, 179, 1);
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  line-height: 20px;

  > div {
    margin-bottom: 10px;
  }
`;

export const CertImage = styled.img`
  width: 160px;
  aspect-ratio: 2.67;
  object-fit: contain;
`;
