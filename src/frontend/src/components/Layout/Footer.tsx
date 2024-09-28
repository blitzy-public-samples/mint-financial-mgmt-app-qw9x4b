import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 20px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <div>
          &copy; {currentYear} Mint Replica. All rights reserved.
        </div>
        <FooterLinks>
          <Link to={ROUTES.ABOUT}>About</Link>
          <Link to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
          <Link to={ROUTES.TERMS_OF_SERVICE}>Terms of Service</Link>
        </FooterLinks>
        <SocialLinks>
          {/* TODO: Add social media icons and links */}
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

// TODO: Provide social media links and icons for the Mint Replica application
// TODO: Create content for About, Privacy Policy, and Terms of Service pages