import React from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
`;

const List = styled.ul`
  margin-bottom: 15px;
`;

const ListItem = styled.li`
  font-size: 1.2rem;
  color: #666;
`;

const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>

      <SectionTitle>Information We Collect</SectionTitle>
      <Paragraph>
        At TribesFlix, we collect the following types of information to provide and improve our
        services to you:
      </Paragraph>
      <List>
        <ListItem>Your name, email address, and contact details.</ListItem>
        <ListItem>Information about your device, such as IP address and browser type.</ListItem>
        <ListItem>Usage data, including pages visited and actions taken on the app.</ListItem>
      </List>

      <SectionTitle>How We Use Your Information</SectionTitle>
      <Paragraph>
        We use the information we collect to:
      </Paragraph>
      <List>
        <ListItem>Provide and personalize our services.</ListItem>
        <ListItem>Communicate with you, including customer support.</ListItem>
        <ListItem>Improve our app’s functionality and user experience.</ListItem>
      </List>

      <SectionTitle>Information Sharing and Disclosure</SectionTitle>
      <Paragraph>
        We do not sell, trade, or otherwise transfer your personal information to third parties
        without your consent.
      </Paragraph>

      <SectionTitle>Security</SectionTitle>
      <Paragraph>
        We take reasonable measures to protect your personal information from unauthorized access or
        disclosure.
      </Paragraph>

      <SectionTitle>Contact Us</SectionTitle>
      <Paragraph>
        If you have any questions about our Privacy Policy, please contact us at
        privacy@tribesflix.com.
      </Paragraph>
    </Container>
  );
};

export default PrivacyPolicy;
