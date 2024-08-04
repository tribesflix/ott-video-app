import React from 'react';
import styled from 'styled-components';
import { IoIosWarning } from "react-icons/io";

const ConfirmationContainer = styled.div`
  width: 320px;
  background: #000000;
  font-family: 'DM Sans', sans-serif;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #0063e5;;
  padding: 1rem ;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 1.125rem;
  text-align: left;
  margin: 0.5rem;
`;

const Article = styled.article`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  color: white;
  width: 100%;
`;

const Button = styled.button`
  background: #0063e5;;
  border-radius: 0.375rem;
  outline: none;
  border: none;
  cursor: pointer;
  color: white;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  width: 50%;
  text-align: center;
`;

const Confirmation = ({ title, onclick }) => {
  return (
    <ConfirmationContainer>
      <Aside>
        <IoIosWarning style={{ fontSize: '30px' }} />
        <Title>{title}</Title>
      </Aside>
      <Article>
        <Button onClick={onclick}>Okay</Button>
      </Article>
    </ConfirmationContainer>
  );
};

export default Confirmation;
