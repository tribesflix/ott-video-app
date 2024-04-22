import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Splash = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <SplashContainer>
          <VideoContainer>
            <Video autoPlay muted loop>
              <source src="/videos/splash.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
          </VideoContainer>
        </SplashContainer>
      )}
    </>
  );
};

const SplashContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  z-index: 99;
`;

const VideoContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default Splash;
