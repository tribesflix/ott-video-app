import React, { useEffect } from 'react';
import styled from 'styled-components';
import ImgSlider from '../components/ImgSlider';
import Recommends from '../components/Recommends';
import WatchList from '../components/WatchList';
import NewReleases from '../components/NewReleases';
import WatchSeries from '../components/WatchSeries';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate('/');
    }
  }, [user]);

  return (
    <Container>
      <ImgSlider />
      <NewReleases />
      <Recommends />
      <WatchSeries />
      <WatchList />
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

export default Home;