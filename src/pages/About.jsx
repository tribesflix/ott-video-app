import React from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  text-align: justify;
`;

const MissionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MissionItem = styled.li`
  margin-bottom: 10px;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #007bff; /* Blue color */
`;

const MissionDescription = styled.p`
  color: #666;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// About component
const About = () => {
  return (
    <Container>
      <Title>Welcome to TribesFlix</Title>
      <ContentWrapper>
        <Description>
          At TribesFlix, we celebrate the rich cultural diversity and storytelling traditions of
          tribes worldwide. Our OTT platform is dedicated to bringing you an immersive
          entertainment experience that resonates with the unique narratives, customs, and values
          of tribal communities.
        </Description>

        <MissionList>
          <MissionItem>
            <Highlight>
              <p>Preserve Cultural Legacies:</p>
            </Highlight>
            <MissionDescription>
              Showcase films, documentaries, and series that authentically portray the diversity
              and richness of tribal cultures.
            </MissionDescription>
          </MissionItem>
          <MissionItem>
            <Highlight>
              <p>Empower Tribal Voices:</p>
            </Highlight>
            <MissionDescription>
              Provide a platform for storytellers, filmmakers, and artists from tribes around the
              globe to share their stories with the world.
            </MissionDescription>
          </MissionItem>
          <MissionItem>
            <Highlight>
              <p>Bridge Communities:</p>
            </Highlight>
            <MissionDescription>
              Foster connections and understanding between tribes and global audiences through the
              universal language of storytelling.
            </MissionDescription>
          </MissionItem>
        </MissionList>

        <ImageWrapper>
          <Image src="/public/images/about.jpg" alt="About Us Image" />
        </ImageWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default About;
