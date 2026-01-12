import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ChartLine,
  Compass,
  Target,
  Briefcase
} from 'phosphor-react';
import AuthFlow from './AuthFlow';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #fbfbfb;
  position: relative;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 40%;
  background: #fbfbfb;
  padding: 32px 60px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightPanel = styled.div`
  width: 60%;
  background: #ffffff;
  padding: 32px;
  min-height: 100vh;
  border-left: 1px solid #e2e8f0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    padding: 16px;
    min-height: calc(100vh - 72px);
    padding-bottom: 90px;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 24px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  img, svg {
    height: 32px;
    width: auto;
  }
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const WelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 440px;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #c71f69;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
`;

const WelcomeDescription = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 24px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #475569;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #c71f69;
`;

const TrustBadgeSection = styled.div`
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    margin-top: 8px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

const TrustBadgeTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const LogoTicker = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    min-height: 40px;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to right, #fbfbfb 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to left, #fbfbfb 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }
`;

const LogoTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;
  animation: ${scroll} 25s linear infinite;
  width: fit-content;
  will-change: transform;

  @media (max-width: 768px) {
    gap: 36px;
    padding-right: 36px;
  }
`;

const CompanyLogo = styled.img`
  height: 36px;
  width: auto;
  object-fit: contain;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 30px;
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 520px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const MobileWelcomeScreen = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    padding: 20px 20px 140px;
    background: #fbfbfb;
  }
`;

const MobileWelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const MobileButtonsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
`;

const StickyMobileCTA = styled.button`
  background: #d80566;
  color: white;
  border: none;
  padding: 18px 32px;
  border-radius: 0;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &:hover {
    background: #b8044d;
  }
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 560px;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  padding: 0;

  @media (max-width: 768px) {
    min-height: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #1e293b;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const ModalBody = styled.div`
  padding: 16px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ScalerLogoSVG = () => (
  <svg height="32" viewBox="0 0 93 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0001 0L0 6.92308V17.0769L12.0001 24L24 17.0769V6.92308L12.0001 0Z" fill="#B30158"/>
    <path d="M35.0195 18.4C32.5595 18.4 30.6595 17.26 30.0195 15.1L32.4795 14.08C32.8195 15.4 33.7195 16.12 35.0795 16.12C36.3195 16.12 36.9595 15.64 36.9595 14.86C36.9595 14.14 36.4395 13.78 35.1195 13.48L33.7995 13.18C31.3995 12.64 30.1995 11.44 30.1995 9.58C30.1995 7.3 32.0795 5.6 34.8795 5.6C37.1595 5.6 38.9395 6.72 39.5395 8.66L37.1195 9.68C36.7795 8.56 35.9395 7.88 34.7995 7.88C33.7195 7.88 33.0595 8.38 33.0595 9.1C33.0595 9.82 33.5595 10.18 34.7595 10.44L36.0795 10.74C38.6395 11.32 39.8195 12.46 39.8195 14.38C39.8195 16.78 37.8395 18.4 35.0195 18.4Z" fill="#1E293B"/>
    <path d="M46.8984 18.4C43.4984 18.4 41.0984 15.94 41.0984 12C41.0984 8.06 43.4984 5.6 46.8984 5.6C49.4984 5.6 51.4384 7.1 52.0384 9.52L49.3584 10.36C49.0784 8.88 48.1384 8 46.8984 8C45.2184 8 44.0784 9.42 44.0784 12C44.0784 14.58 45.2184 16 46.8984 16C48.1384 16 49.0784 15.12 49.3584 13.64L52.0384 14.48C51.4384 16.9 49.4984 18.4 46.8984 18.4Z" fill="#1E293B"/>
    <path d="M59.5078 18.4C56.0278 18.4 53.5878 15.94 53.5878 12C53.5878 8.06 56.0278 5.6 59.5078 5.6C62.3478 5.6 64.3878 7.14 64.9278 9.58L62.2878 10.42C61.9478 8.9 60.9878 8 59.5078 8C57.8278 8 56.5678 9.42 56.5678 12C56.5678 14.58 57.8278 16 59.5078 16C60.9478 16 61.9278 15.18 62.2478 13.76L64.9078 14.56C64.3478 16.92 62.3478 18.4 59.5078 18.4Z" fill="#1E293B"/>
    <path d="M66.5391 18.2V5.8H69.3391V18.2H66.5391Z" fill="#1E293B"/>
    <path d="M77.3281 18.4C73.8481 18.4 71.3281 15.94 71.3281 12C71.3281 8.06 73.8481 5.6 77.3281 5.6C80.7481 5.6 83.2481 8.06 83.2481 12C83.2481 15.94 80.7481 18.4 77.3281 18.4ZM77.3281 16C79.0081 16 80.2681 14.58 80.2681 12C80.2681 9.42 79.0081 8 77.3281 8C75.6081 8 74.3081 9.42 74.3081 12C74.3081 14.58 75.6081 16 77.3281 16Z" fill="#1E293B"/>
    <path d="M84.9297 18.2V5.8H93.0097V8.1H87.7297V10.7H92.4097V13H87.7297V15.9H93.0097V18.2H84.9297Z" fill="#1E293B"/>
  </svg>
);

/**
 * LoggedOutScreen - Shows auth forms when user is not logged in
 * Split layout with features on left, auth forms on right
 */
export function LoggedOutScreen({ 
  initialMode = 'login'
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const companies = useMemo(() => ([
    { name: 'Razorpay', logo: 'https://cdn.brandfetch.io/razorpay.com/w/400/h/400' },
    { name: 'Swiggy', logo: 'https://cdn.brandfetch.io/swiggy.com/w/400/h/400' },
    { name: 'CRED', logo: 'https://cdn.brandfetch.io/cred.club/w/400/h/400' },
    { name: 'Unacademy', logo: 'https://cdn.brandfetch.io/unacademy.com/w/400/h/400' },
    { name: 'Zoho', logo: 'https://cdn.brandfetch.io/zoho.com/w/400/h/400' },
    { name: 'Paytm', logo: 'https://cdn.brandfetch.io/paytm.com/w/400/h/400' },
    { name: 'PhonePe', logo: 'https://cdn.brandfetch.io/phonepe.com/w/400/h/400' },
    { name: 'Zomato', logo: 'https://cdn.brandfetch.io/zomato.com/w/400/h/400' }
  ]), []);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  if (isMobile) {
    return (
      <>
        <MobileWelcomeScreen>
          <MobileWelcomeContent>
            <LogoContainer>
              <Logo>
                <ScalerLogoSVG />
              </Logo>
            </LogoContainer>
            <WelcomeContent>
              <WelcomeTitle>Career Roadmap Tool</WelcomeTitle>
              <WelcomeSubtitle>Your Personalized Tech Career Path</WelcomeSubtitle>
              <WelcomeDescription>
                Get a customized learning roadmap tailored to your career goals. Discover the skills you need, find the right resources, and track your progress toward your dream tech role.
              </WelcomeDescription>
              <FeaturesList>
                <Feature>
                  <IconContainer>
                    <Compass size={18} weight="regular" />
                  </IconContainer>
                  Personalized Learning Path
                </Feature>
                <Feature>
                  <IconContainer>
                    <ChartLine size={18} weight="regular" />
                  </IconContainer>
                  Skill Gap Analysis
                </Feature>
                <Feature>
                  <IconContainer>
                    <Target size={18} weight="regular" />
                  </IconContainer>
                  Role-Specific Roadmaps
                </Feature>
                <Feature>
                  <IconContainer>
                    <Briefcase size={18} weight="regular" />
                  </IconContainer>
                  Company-Aligned Skills
                </Feature>
              </FeaturesList>
            </WelcomeContent>

            <TrustBadgeSection>
              <TrustBadgeTitle>Trusted by our alumni, who are working at</TrustBadgeTitle>
              <LogoTicker>
                <LogoTrack>
                  {companies.map((c, i) => (
                    <CompanyLogo key={`m-logo-${i}`} src={c.logo} alt={c.name} />
                  ))}
                  {companies.map((c, i) => (
                    <CompanyLogo key={`m-logo-dup-${i}`} src={c.logo} alt={c.name} />
                  ))}
                </LogoTrack>
              </LogoTicker>
            </TrustBadgeSection>
          </MobileWelcomeContent>
          <MobileButtonsContainer>
            <StickyMobileCTA onClick={openAuth}>Continue</StickyMobileCTA>
          </MobileButtonsContainer>
        </MobileWelcomeScreen>

        {showAuthModal && (
          <ModalOverlay>
            <ModalCard role="dialog" aria-modal="true">
              <ModalHeader>
                <ModalTitle>Continue to sign in</ModalTitle>
                <CloseButton aria-label="Close" onClick={closeAuth}>✕</CloseButton>
              </ModalHeader>
              <ModalBody>
                <AuthFlow
                  initialMode={initialMode}
                  reloadOnSuccess={true}
                />
              </ModalBody>
            </ModalCard>
          </ModalOverlay>
        )}
      </>
    );
  }

  return (
    <PageContainer>
      <LeftPanel>
        <LogoContainer>
          <Logo>
            <ScalerLogoSVG />
          </Logo>
        </LogoContainer>

        <WelcomeContent>
          <WelcomeTitle>Career Roadmap Tool</WelcomeTitle>
          <WelcomeSubtitle>Your Personalized Tech Career Path</WelcomeSubtitle>
          <WelcomeDescription>
            Get a customized learning roadmap tailored to your career goals. Discover the skills you need, find the right resources, and track your progress toward your dream tech role.
          </WelcomeDescription>
          <FeaturesList>
            <Feature>
              <IconContainer>
                <Compass size={18} weight="regular" />
              </IconContainer>
              Personalized Learning Path
            </Feature>
            <Feature>
              <IconContainer>
                <ChartLine size={18} weight="regular" />
              </IconContainer>
              Skill Gap Analysis
            </Feature>
            <Feature>
              <IconContainer>
                <Target size={18} weight="regular" />
              </IconContainer>
              Role-Specific Roadmaps
            </Feature>
            <Feature>
              <IconContainer>
                <Briefcase size={18} weight="regular" />
              </IconContainer>
              Company-Aligned Skills
            </Feature>
          </FeaturesList>
        </WelcomeContent>

        <TrustBadgeSection>
          <TrustBadgeTitle>Trusted by our alumni, who are working at</TrustBadgeTitle>
          <LogoTicker>
            <LogoTrack>
              {companies.map((c, i) => (
                <CompanyLogo key={`logo-${i}`} src={c.logo} alt={c.name} />
              ))}
              {companies.map((c, i) => (
                <CompanyLogo key={`logo-dup-${i}`} src={c.logo} alt={c.name} />
              ))}
            </LogoTrack>
          </LogoTicker>
        </TrustBadgeSection>
      </LeftPanel>

      <RightPanel>
        <AuthCard>
          <AuthFlow
            initialMode={initialMode}
            reloadOnSuccess={true}
          />
        </AuthCard>
      </RightPanel>
    </PageContainer>
  );
}

export default LoggedOutScreen;
