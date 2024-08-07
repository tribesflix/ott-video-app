import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  z-index: 50;
`;

const Loads = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #0063e5;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = () => {
  return (
    <LoaderWrapper>
      <Loads />
    </LoaderWrapper>
  );
};

export default Spinner;
