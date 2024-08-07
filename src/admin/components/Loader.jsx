import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <Container>
      <Text>
        <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate"
                dur="1s" 
                from="0 50 50"
                to="360 50 50" 
                repeatCount="indefinite" />
          </path>
        </svg>
      </Text>
    </Container>
  )
}

const Container = styled.main`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
`;

const Text = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

export default Loader;
