import React from 'react';
import styled from 'styled-components';
import { IoIosWarning } from "react-icons/io";

const ConfirmationContainer = styled.div`
  width: 320px;
  background: #000000;
  border-radius: 2xl;
  cursor: pointer;
  border: 1px solid #D9D9D9; /* Replace this with the correct color for border-allotrix-std */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 1024px) {
    width: 500px;
  }
`;

const Aside = styled.aside`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const Video = styled.video`
  height: 100px;
  width: 100px;
`;

const Title = styled.h3`
  color: #ffffff;
  font-family: 'allotrix-font-secondary';
  font-size: 1.125rem;
  text-align: left;
  margin: 0.5rem;
`;

const Article = styled.article`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  font-family: 'allotrix-font-secondary';
  color: white;
  width: 100%;
`;

const Button = styled.button`
  background: #D9D9D9; /* Replace this with the correct color for bg-allotrix-std */
  border-radius: 0.375rem;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  width: 50%;
  text-align: center;
`;

const Confirmation = ({ title, onYes, onNo }) => {
  return (
    <ConfirmationContainer>
      <Aside>
        <IoIosWarning style={{ fontSize: '30px' }} />
        <Title>{title}</Title>
      </Aside>
      <Article>
        <Button onClick={onNo}>No</Button>
        <Button onClick={onYes}>Yes</Button>
      </Article>
    </ConfirmationContainer>
  );
};

export default Confirmation;
