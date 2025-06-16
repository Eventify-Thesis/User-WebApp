import React from 'react';
import * as s from './Footer.styles';

export const Footer: React.FC = () => {
  return (
    <s.FooterWrapper>
      <s.MainFooter>
        <s.FooterGrid>
          <s.ContactColumn>
            <s.FooterTitle>Contact Information</s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2d6eb5e3b8442c0e33725a6e8fbd4991392a378a0d644fb38c14921792fe17?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Phone"
              />
              <s.ContactText>Available: Mon - Fri (9:00 - 17:00)</s.ContactText>
            </s.ContactInfo>
            <s.PhoneNumber>+84 123 456 789</s.PhoneNumber>

            <s.FooterTitle style={{ marginTop: '32px' }}>Email</s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/78bf3f39392eef75ddb3d1b5547dab386b060fd4201f34fa2c28ac68dd05a445?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Email"
              />
              <s.ContactText>contact@eventhub.edu.vn</s.ContactText>
            </s.ContactInfo>

            <s.FooterTitle style={{ marginTop: '32px' }}>
              University
            </s.FooterTitle>
            <s.ContactInfo>
              <s.ContactIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/576dbcf778046558625b2872937ccf24274aed79302943948795270fb4cfd228?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Location"
              />
              <s.AddressText>
                Ho Chi Minh University of Science
                <br />
                227 Nguyen Van Cu Street, District 5, Ho Chi Minh City
              </s.AddressText>
            </s.ContactInfo>
          </s.ContactColumn>

          <s.LinksColumn>
            <s.FooterTitle>For Event Organizers</s.FooterTitle>
            <s.FooterLink>Event Management Guidelines</s.FooterLink>
            <s.FooterLink>Terms of Service for Organizers</s.FooterLink>
            <s.FooterLink>Event Publishing Standards</s.FooterLink>

            <s.FooterTitle style={{ marginTop: '32px' }}>
              For Event Attendees
            </s.FooterTitle>
            <s.FooterLink>User Terms and Conditions</s.FooterLink>
            <s.FooterLink>Booking & Cancellation Policy</s.FooterLink>

            <s.NewsletterSection>
              <s.FooterTitle>
                Subscribe for the latest events and updates
              </s.FooterTitle>
              <s.NewsletterInput>
                <s.InputWrapper>
                  <s.EmailIcon
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/72a6f5f2be64fc9c2574c20c994091e8df04861d80780be9ae7a3cf6059ec9d4?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                    alt="Email"
                  />
                  <s.Input placeholder="Enter your email" />
                </s.InputWrapper>
                <s.SubmitIcon
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e7f7e5c3f8ce5faf370941035cf9aa6278ec6952b4a0845c0857c2c182c1447?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                  alt="Submit"
                />
              </s.NewsletterInput>
            </s.NewsletterSection>
          </s.LinksColumn>

          <s.CompanyColumn>
            <s.FooterTitle>Project Information</s.FooterTitle>
            <s.FooterLink>Privacy Policy</s.FooterLink>
            <s.FooterLink>Data Protection</s.FooterLink>
            <s.FooterLink>Academic Research Guidelines</s.FooterLink>
            <s.FooterLink>Open Source License</s.FooterLink>
            <s.FooterLink>Project Documentation</s.FooterLink>
            <s.FooterLink>Technical Support</s.FooterLink>
            <s.FooterLink>Feedback & Suggestions</s.FooterLink>
          </s.CompanyColumn>
        </s.FooterGrid>

        <s.Divider />

        <s.AppSection>
          <s.AppColumn>
            <s.FooterTitle>GitHub Repository</s.FooterTitle>
            <s.FooterLink
              style={{ color: '#4fc3f7', marginTop: '12px', fontSize: '14px' }}
            >
              🔗 View Source Code on GitHub
            </s.FooterLink>
            <s.FooterLink
              style={{ color: '#81c784', marginTop: '8px', fontSize: '14px' }}
            >
              📚 Project Documentation
            </s.FooterLink>
            <s.FooterLink
              style={{ color: '#ffb74d', marginTop: '8px', fontSize: '14px' }}
            >
              🐛 Report Issues
            </s.FooterLink>
          </s.AppColumn>

          <s.AppColumn>
            <s.FooterTitle>Technology Stack</s.FooterTitle>
            <s.FooterLink
              style={{ color: '#61dafb', marginTop: '12px', fontSize: '14px' }}
            >
              ⚛️ React & TypeScript
            </s.FooterLink>
            <s.FooterLink
              style={{ color: '#10b981', marginTop: '8px', fontSize: '14px' }}
            >
              🚀 Node.js & Express
            </s.FooterLink>
            <s.FooterLink
              style={{ color: '#3b82f6', marginTop: '8px', fontSize: '14px' }}
            >
              🗄️ PostgreSQL Database
            </s.FooterLink>
          </s.AppColumn>

          <s.SocialColumn>
            <s.FooterTitle>Connect with us</s.FooterTitle>
            <s.SocialIcons>
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5db95312c2ecbeb4ef383a24b742d40d4d014775748e90f25bee0d4ba28df707?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Facebook"
              />
              <s.SocialIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f581e374eb9c8612a81c7c089c860f5eeaa37e4da2cce46024fc53f5f6135e2?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Instagram"
              />
            </s.SocialIcons>

            <s.FooterTitle style={{ marginTop: '27px' }}>
              Language
            </s.FooterTitle>
            <s.LanguageSelector>
              <s.LanguageIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/10b997aea9824fbb5575e28d0189411c55dba07f8129e28c0665aa671f2ccf9d?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="Vietnamese"
              />
              <s.LanguageIcon
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/312c0c11b042597aed948738169756b9920defdcd3088e4825e5de35096e1815?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                alt="English"
              />
            </s.LanguageSelector>
          </s.SocialColumn>
        </s.AppSection>
      </s.MainFooter>

      <s.BottomFooter>
        <s.BottomGrid>
          <s.LogoColumn>
            <s.CompanyInfo style={{ marginTop: 0 }}>
              <strong>Academic Event Management Platform</strong>
              <br />
              Student Research Project © 2024
              <br />
              Ho Chi Minh University of Science
            </s.CompanyInfo>
          </s.LogoColumn>

          <s.InfoColumn>
            <s.CompanyDetails>
              <div>
                <strong>👨‍💻 Development Team:</strong>
              </div>
              <div>
                🎓 <strong>Bùi Nguyên Hoàng</strong> - Lead Developer & System
                Architect
              </div>
              <div>
                🎓 <strong>Nguyễn Trọng Nghĩa</strong> - Fullstack Developer
              </div>
              <br />
              <div>
                <strong>🏫 Academic Information:</strong>
              </div>
              <div>
                <strong>University:</strong> Ho Chi Minh University of Science
              </div>
              <div>
                <strong>Faculty:</strong> Information Technology
              </div>
              <div>
                <strong>Program:</strong> Bachelor of Science in Computer
                Science
              </div>
              <div>
                <strong>Academic Year:</strong> 2024
              </div>
              <br />
              <div>
                <strong>📧 Contact:</strong> contact@eventhub.edu.vn
              </div>
              <div>
                <strong>📋 Thesis Topic:</strong> Development of a Comprehensive
                Event Management and Discovery Platform with Advanced Search and
                Recommendation Systems
              </div>
            </s.CompanyDetails>
          </s.InfoColumn>
        </s.BottomGrid>
      </s.BottomFooter>
    </s.FooterWrapper>
  );
};
