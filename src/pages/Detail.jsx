import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../lib/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import Popup from "reactjs-popup";
import { FaArrowCircleLeft, FaPlus, FaShare, FaCheck } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import Plyr from 'plyr-react';
import "plyr-react/plyr.css";

const Detail = () => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [watchlistIcon, setWatchlistIcon] = useState(false);
  const [movie, setMovie] = useState('');
  const [videoKey, setVideoKey] = useState(Date.now());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieDoc = await getDoc(doc(db, "movies", id));
        if (movieDoc.exists()) {
          setDetailData({ id: movieDoc.id, ...movieDoc.data() });
          setMovie(movieDoc.data().movieURL); // Set initial movie URL
        } else {
          console.log("No such document exists");
        }

        const watchlistDoc = await getDoc(doc(db, "users", user.uid, "watchlist", id));
        if (watchlistDoc.exists()) {
          setWatchlistIcon(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href
        });
        console.log("URL shared successfully");
      } catch (error) {
        console.error("Error sharing URL:", error);
      }
    } else {
      console.log("Web Share API not supported");
    }
  };

  const addToWatchList = async () => {
    if (!watchlistIcon) {
      setWatchlistIcon(true);
      await setDoc(doc(collection(db, "users", user.uid, "watchlist"), detailData.id), detailData);
    } else {
      setWatchlistIcon(false);
      await deleteDoc(doc(db, "users", user.uid, "watchlist", detailData.id));
    }
  };

  const getTranscodedUrl = (quality) => {
    const qualityMapping = {
      '1080p': 'f_auto,q_100',
      '720p': 'f_auto,q_75',
      '480p': 'f_auto,q_50',
      '240p': 'f_auto,q_20'
    };
    const transformation = qualityMapping[quality];
    const newUrl = detailData.movieURL.replace('/upload/', `/upload/${transformation}/`);
    setMovie(newUrl);
    setVideoKey(Date.now()); 
  };

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>

      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <Popup
            trigger={
              <PlayerButton>
                <img src="/images/play-icon-black.png" alt="" />
                <span>Play</span>
              </PlayerButton>
            }
            modal
            nested
          >
            {
              (close) => (
                <Modal>
                  <MenuBar>
                    <CloseBtn onClick={() => close()}>
                      <FaArrowCircleLeft />
                    </CloseBtn>
                    <Description>{detailData.title}</Description>
                  </MenuBar>
                  <Plyr
                    source={{
                      type: 'video',
                      sources: [
                        {
                          src: movie,
                          type: 'video/mp4',
                        },
                      ],
                    }}
                    options={{
                      autoplay: true,
                      controls: ['rewind','play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen', 'pip'],
                      settings: ['speed']
                    }}
                  />
                  <Box>
                    <QualitySwitch onClick={() => getTranscodedUrl('1080p')}>
                      1080p
                    </QualitySwitch>
                    <QualitySwitch onClick={() => getTranscodedUrl('720p')}>
                      720p
                    </QualitySwitch>
                    <QualitySwitch onClick={() => getTranscodedUrl('480p')}>
                      480p
                    </QualitySwitch>
                    <QualitySwitch onClick={() => getTranscodedUrl('240p')}>
                      240p
                    </QualitySwitch>
                  </Box>
                </Modal>
              )
            }
          </Popup>
          <Popup
            trigger={
              <Trailer>
                <img src="/images/play-icon-white.png" alt="" />
                <span>Trailer</span>
              </Trailer>
            }
            modal
            nested
          >
            {
              (close) => (
                <Modal>
                  <MenuBar>
                    <CloseBtn onClick={() => close()}>
                      <FaArrowCircleLeft />
                    </CloseBtn>
                    <Description>{detailData.title} - Trailer</Description>
                  </MenuBar>
                  <Plyr
                    source={{
                      type: 'video',
                      sources: [
                        {
                          src: detailData.trailerURL,
                          type: 'video/mp4',
                        },
                      ],
                    }}
                    options={{
                      autoplay: true,
                      controls: ['rewind','play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen', 'pip'],
                      settings: ['speed']
                    }}
                  />
                </Modal>
              )
            }
          </Popup>
          <AddList onClick={addToWatchList}>
            {!watchlistIcon ? (<FaPlus style={{ color: 'white', fontSize: '18px' }} />) : (<FaCheck style={{ color: 'white', fontSize: '18px' }} />)}
          </AddList>
          <GroupWatch onClick={handleShare}>
            <div>
              <FaShare />
            </div>
          </GroupWatch>
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: calc(100vh-250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Box = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 20px 0;
`;

const QualitySwitch = styled.button`
  color: #f9f9f9;
  font-weight: bold;
  background-color: #0063e5;
  border-radius: 4px;
  border: 1px solid transparent;
  outline: none;
  padding: 2px 10px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const PlayerButton = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb(249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(PlayerButton)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const Modal = styled.div`
  width: 700px;
  background: url("/images/home-background.png") center center / cover;
  border-radius: 12px;
  border: 2px solid rgb(249, 249, 249);
  margin: auto;
  margin-top: 30px;
  padding: 10px;

  @media (max-width: 768px) {
    width: auto;
    margin: auto 13px;
  }
`;

const MenuBar = styled.div`
  width: 100%;
  padding: 4px 12px;
  border-bottom: 2px solid rgb(249, 249, 249);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: rgb(249, 249, 249);
  font-size: 22px;
`;

const AddList = styled.button`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;

  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    display: grid;
    place-items: center;

    svg {
      width: 100%;
      font-size: 18px;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StyledPlyr = styled.video`
  width: 100%;
  height: 400px; // Adjust the height as needed

  @media (max-width: 768px) {
    height: 300px; // Adjust for smaller screens
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default Detail;
