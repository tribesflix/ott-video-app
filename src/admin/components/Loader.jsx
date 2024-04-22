import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <Container>
      <Text>
        Uploading...
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
