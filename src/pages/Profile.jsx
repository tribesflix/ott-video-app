import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styled from 'styled-components';
import Payment from '../components/Payment';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Profile = () => {

    const { user, handleSignOut } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if(!user) {
        navigate('/login');
      }
    }, [user]);

    return (
        <Container>
            <section>
                <AccountContainer>
                    <ProfileImage>
                        <img src={user?.photo} alt="AV" />
                    </ProfileImage>
                    <ProfileData>
                        <h2>Hey! {user?.name}</h2>
                        <h3>
                            Account: {user?.email}
                        </h3>
                        <h4>
                          Current plan: {user?.subscription}
                        </h4>
                        <h5>
                            Role: {user?.type}
                        </h5>
                    </ProfileData>
                </AccountContainer>
                <ButtonContainer>
                  <Button onClick={handleSignOut}>
                    Sign Out
                  </Button>
                  <Button>
                    Edit Profile
                  </Button>
                </ButtonContainer>
            </section>
            <section>
              <Heading>
                Upgrade Plan
              </Heading>
              <Payment />
            </section>
        </Container>
    )
}

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url("/images/home-background.png") center center / cover;
    no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

const Heading = styled.h2`
  text-align: center;
  margin-top: 40px;
`;

const AccountContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;

    @media screen and (max-width: 600px) {
        flex-direction: column;
        gap: 20px;
        padding: 40px 0;
    }
`;

const ProfileImage = styled.aside`
  height: 150px;
  width: 150px;
  border-radius: 50%;

  img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 50%;
  }
`;

const ProfileData = styled.article`
  h2 {
    font-size: 50px;
  }
`;

const PricingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
}
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 30px 0;
`;

const Button = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 14px;
  padding: 7px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

export default Profile;
