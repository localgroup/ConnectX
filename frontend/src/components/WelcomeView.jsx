import React, { useState } from 'react';
import styled from '@emotion/styled';
import "../styles/Welcome.css";


const AppContainer = styled.div`
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ConnectXLogo = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 2rem auto;
`;

const XIcon = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: #1da1f2;
  text-shadow: 0 0 10px #1da1f2;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const ConnectXLogoComponent = () => (
  <LogoContainer>
    <ConnectXLogo>
      <XIcon>Connect[X]</XIcon>
    </ConnectXLogo>
  </LogoContainer>
);

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: -0.05em;
`;

const SubHeading = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: black;
  border: 1px solid #333;
  border-radius: 0.25rem;
  color: white;
  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const PrimaryButton = styled(Button)`
  background-color: white;
  color: black;
  &:hover {
    background-color: #e6e6e6;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: black;
  color: #1da1f2;
  border: 1px solid #1da1f2;
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #333;
  }
  &::before {
    margin-right: 0.5em;
  }
  &::after {
    margin-left: 0.5em;
  }
`;

const SmallText = styled.p`
  font-size: 0.75rem;
  color: #666;
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #666;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 0.5rem;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  color: #666;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Welcomeview() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { email, username });
  };

  return (
    <AppContainer>
      <Main>
        <Card>
          <CardContent>
            <ConnectXLogoComponent />
            <div>
              <Heading>Happening now</Heading>
              <SubHeading>Join today.</SubHeading>
            </div>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <PrimaryButton type="submit">Next</PrimaryButton>
            </Form>
            <Divider>or</Divider>
            <SecondaryButton>Create account</SecondaryButton>
            <SmallText>
              By signing up, you agree to the <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>, including <a href="#">Cookie Use</a>.
            </SmallText>
            <div>
              <SubHeading>Already have an account?</SubHeading>
              <SecondaryButton>Sign in</SecondaryButton>
            </div>
          </CardContent>
        </Card>
      </Main>
      <Footer>
        <FooterNav>
          {['About', 'Download the ConnectX app', 'Help Center', 'Terms of Service', 
            'Privacy Policy', 'Cookie Policy', 'Accessibility', 'Ads info', 'Blog', 
            'Careers', 'Brand Resources', 'Advertising', 'Marketing', 'ConnectX for Business', 
            'Developers', 'Directory', 'Settings'].map((link) => (
            <FooterLink key={link} href="#">{link}</FooterLink>
          ))}
        </FooterNav>
        <p>© 2024 ConnectX Corp.</p>
      </Footer>
    </AppContainer>
  );
}