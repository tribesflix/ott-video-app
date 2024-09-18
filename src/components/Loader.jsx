// Loader.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for spinning animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled component for the loader
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  z-index: 9999; /* Ensures it stays above all components */
`;

const LoaderContainer = styled.div`
  width: 80px;
  height: 80px;

  &:after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #0063e5; /* Loader color */
    border-color: #0063e5 transparent #0063e5 transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`;

// Loader component
const Loader = () => {
  return (
    <Overlay>
      <LoaderContainer />
    </Overlay>
  );
};

export default Loader;
