import React from "react";
import * as s from "./Footer.styles"
export const Footer: React.FC = () => {
  return (
    <s.FooterWrapper>
      <s.MainFooter>
        <s.FooterGrid>
          <s.ContactColumn>
            <s.FooterTitle>Hotline</s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2d6eb5e3b8442c0e33725a6e8fbd4991392a378a0d644fb38c14921792fe17?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Phone"
              />
              <s.ContactText>Thứ 2 - Thứ 6 (8:30 - 18:30)</s.ContactText>
            </s.ContactInfo>
            <s.PhoneNumber>1900.6408</s.PhoneNumber>

            <s.FooterTitle style={{ marginTop: "32px" }}>Email</s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/78bf3f39392eef75ddb3d1b5547dab386b060fd4201f34fa2c28ac68dd05a445?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Email"
              />
              <s.ContactText>support@ticketbox.vn</s.ContactText>
            </s.ContactInfo>

            <s.FooterTitle style={{ marginTop: "32px" }}>Văn phòng</s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/576dbcf778046558625b2872937ccf24274aed79302943948795270fb4cfd228?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Location"
              />
              <s.AddressText>
                Lầu 12, 17 Bà Huyện Thanh Quan, Phường 6, Quận 3, TP. Hồ Chí
                Minh
              </s.AddressText>
            </s.ContactInfo>
          </s.ContactColumn>

          <s.LinksColumn>
            <s.FooterTitle>Dành cho Khách hàng</s.FooterTitle>
            <s.FooterLink>Điều khoản sử dụng cho khách hàng</s.FooterLink>

            <s.FooterTitle style={{ marginTop: "32px" }}>
              Dành cho Ban Tổ chức
            </s.FooterTitle>
            <s.FooterLink>Điều khoản sử dụng cho ban tổ chức</s.FooterLink>

            <s.NewsletterSection>
              <s.FooterTitle>
                Đăng ký nhận email về các sự kiện hot nhất
              </s.FooterTitle>
              <s.NewsletterInput>
                <s.InputWrapper>
                  <s.EmailIcon
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/72a6f5f2be64fc9c2574c20c994091e8df04861d80780be9ae7a3cf6059ec9d4?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                    alt="Email"
                  />
                  <s.Input placeholder="Your Email" />
                </s.InputWrapper>
                <s.SubmitIcon
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e7f7e5c3f8ce5faf370941035cf9aa6278ec6952b4a0845c0857c2c182c1447?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                  alt="Submit"
                />
              </s.NewsletterInput>
            </s.NewsletterSection>
          </s.LinksColumn>

          <s.CompanyColumn>
            <s.FooterTitle>Về công ty chúng tôi</s.FooterTitle>
            <s.FooterLink>Quy chế hoạt động</s.FooterLink>
            <s.FooterLink>Chính sách bảo mật thông tin</s.FooterLink>
            <s.FooterLink>Cơ chế giải quyết tranh chấp/ khiếu nại</s.FooterLink>
            <s.FooterLink>Chính sách bảo mật thanh toán</s.FooterLink>
            <s.FooterLink>Chính sách đổi trả và kiểm hàng</s.FooterLink>
            <s.FooterLink>Điều kiện vận chuyển và giao nhận</s.FooterLink>
            <s.FooterLink>Phương thức thanh toán</s.FooterLink>
          </s.CompanyColumn>
        </s.FooterGrid>

        <s.Divider />

        <s.AppSection>
          <s.AppColumn>
            <s.FooterTitle>Ứng dụng Ticketbox</s.FooterTitle>
            <s.AppImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/df22944cb23a2c8a14c0addc0d3c857ef07a6226175ffcd61f5e94ac16d8896e?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="App Store"
            />
            <s.AppImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee3ee32f3ca1ab56a5b4ba1c68543c22352b87fdfbfd8c02457449366a05df62?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="Google Play"
            />
          </s.AppColumn>

          <s.AppColumn>
            <s.FooterTitle>Ứng dụng check-in cho Ban tổ chức</s.FooterTitle>
            <s.AppImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1fd155cf674d152660be5c9a81cb899a1bcde9d5bf68052832ea70223a34e133?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="App Store"
            />
            <s.AppImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ded55bee2327d1c9a21f9074198cec3ffce9ab2564bf132ca932dac047bac3c9?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="Google Play"
            />
          </s.AppColumn>

          <s.SocialColumn>
            <s.FooterTitle>Follow us</s.FooterTitle>
            <s.SocialIcons>
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5db95312c2ecbeb4ef383a24b742d40d4d014775748e90f25bee0d4ba28df707?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Social"
              />
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f581e374eb9c8612a81c7c089c860f5eeaa37e4da2cce46024fc53f5f6135e2?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Social"
              />
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a6eb57d77e90e34965ff4536dd2cc1e9918223c6f025092faf6bdfd0853f90a8?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Social"
              />
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/617708c3418020b6cd254efd4f50348819a9e39910d6ee8eddd13739dd2ed7fd?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Social"
              />
            </s.SocialIcons>

            <s.FooterTitle style={{ marginTop: "27px" }}>Ngôn ngữ</s.FooterTitle>
            <s.LanguageSelector>
              <s.LanguageIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/10b997aea9824fbb5575e28d0189411c55dba07f8129e28c0665aa671f2ccf9d?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Language"
              />
              <s.LanguageIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/312c0c11b042597aed948738169756b9920defdcd3088e4825e5de35096e1815?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Language"
              />
            </s.LanguageSelector>
          </s.SocialColumn>
        </s.AppSection>
      </s.MainFooter>

      <s.BottomFooter>
        <s.BottomGrid>
          <s.LogoColumn>
            <s.FooterLogo
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d077b1d7b3538223c14467e6496f852e022ab7ceb66c0b9b341cb993b082b02c?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="Logo"
            />
            <s.CompanyInfo>
              Hệ thống quản lý và phân phối vé sự kiện hàng đầu Việt Nam
              <br />
              TicketBox Co. Ltd. © 2016
            </s.CompanyInfo>
          </s.LogoColumn>

          <s.InfoColumn>
            <s.CompanyDetails>
              <div>Công ty TNHH Ticketbox</div>
              <div>Đại diện theo pháp luật: Phạm Thị Hường</div>
              <div>
                Địa chỉ: Tầng 12, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám,
                Phường 12, Quận 10, TP. Hồ Chí Minh
              </div>
              <div>Hotline: 1900.6408 - Email: support@ticketbox.vn</div>
              <div>
                Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu
                ngày 07/01/2016 bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh
              </div>
            </s.CompanyDetails>
            <s.CertImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5e8040b415ce5ea29448e5936324cc2b17741b94fc35d40c658bca2f29ddd8f2?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
              alt="Certification"
            />
          </s.InfoColumn>
        </s.BottomGrid>
      </s.BottomFooter>
    </s.FooterWrapper>
  );
};
