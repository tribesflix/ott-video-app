import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import Confirmation from './Confirmation';

const Card = styled.div`
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 200px;
  text-align: left;
  background-color: #f7f7f7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const Price = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  color: #007bff;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
  color: #666;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

const PricingCard = ({ title, price, features, onclick }) => {

  const alreadyFree = () => {
    alert("Already using free plan");
  }

  return (
    <Card>
      <Title>{title}</Title>
      <Price>INR {price}<span style={{fontSize: '14px'}}></span></Price>
      <FeatureList>
        {features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </FeatureList>
      {
        title === "Free" ? (
          <Popup overlayStyle={{ background: 'rgba(0, 0, 0, .5)' }} trigger={<Button>
            Get Started
          </Button>} modal nested>
            {
              close => (
                <Confirmation title={"Currently using Free Plan"} onclick={() => close()} />
              )
            }
          </Popup>
        ) : (
          <Button onClick={onclick}>
            Get Started
          </Button>
        )
      }
    </Card>
  );
};

export default PricingCard;
