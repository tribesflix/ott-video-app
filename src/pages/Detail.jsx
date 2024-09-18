import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../lib/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import Popup from "reactjs-popup";
import { FaArrowCircleLeft, FaPlus, FaShare, FaCheck } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import Plyr from 'plyr-react';
import "plyr-react/plyr.css";
import Confirmation from "../components/Confirmation";
import { LuFileSignature } from "react-icons/lu";
import Countdown from 'react-countdown';

const Detail = () => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [watchlistIcon, setWatchlistIcon] = useState(false);
  const [rented, setRented] = useState(false);
  const [rentalExpiration, setRentalExpiration] = useState(null);
  const [movie, setMovie] = useState('');
  const { user } = useContext(AuthContext);
  const playerRef = useRef(null);  // Reference to the Plyr instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieDoc = await getDoc(doc(db, "movies", id));
        if (movieDoc.exists()) {
          setDetailData({ id: movieDoc.id, ...movieDoc.data() });
          setMovie(movieDoc.data().movieURLs['480p']); // Default to 480p or adjust based on preference
        } else {
          console.log("No such document exists");
        }

        const watchlistDoc = await getDoc(doc(db, "users", user.uid, "watchlist", id));
        if (watchlistDoc.exists()) {
          setWatchlistIcon(true);
        }

        const rentedDoc = await getDoc(doc(db, "users", user.uid, "rentals", id));
        if (rentedDoc.exists()) {
          const { createdAt } = rentedDoc.data();
          const expirationTime = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;
          setRentalExpiration(expirationTime);
          setRented(true);
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

  const isRentalValid = () => {
    if (rentalExpiration) {
      return Date.now() < rentalExpiration;
    }
    return false;
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`, 
      amount: 10 * 100,
      currency: 'INR',
      name: 'Tribesflix',
      description: 'Subscription Payment',
      image: 'https://i.postimg.cc/wMVZwWkB/tribesflix.png',
      handler: async function (response) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);
        if(!rented) {
          setRented(true);
          const createdAt = new Date().toISOString();
          await setDoc(doc(collection(db, "users", user.uid, "rentals"), detailData.id), {
            ...detailData,
            createdAt
          });
          const expirationTime = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;
          setRentalExpiration(expirationTime);
        }
      },
      prefill: {
        name: 'Tribesflix',
        email: 'gitafoodproducts@gmail.com',
        contact: '9002330168'
      },
      notes: {
        address: 'Asanol, West Bengal, India'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const getTranscodedUrl = (quality) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.plyr.currentTime; // Get current playback time
      localStorage.setItem('currentPlaybackTime', currentTime); // Store current time in localStorage
    }

    // Get the URL for the selected quality from detailData
    const url = detailData.movieURLs[quality];
    if (url) {
      setMovie(url);
    }
  };

  useEffect(() => {
    if (playerRef.current && movie) {
      const storedTime = localStorage.getItem('currentPlaybackTime'); // Retrieve time from localStorage
      playerRef.current.plyr.source = {
        type: 'video',
        sources: [{ src: movie, type: 'video/mp4' }]
      };

      playerRef.current.plyr.on('canplay', () => {
        if (storedTime) {
          playerRef.current.plyr.currentTime = parseFloat(storedTime); // Set playback time to the stored value
          localStorage.removeItem('currentPlaybackTime'); // Clear localStorage after setting time
        }
        playerRef.current.plyr.play(); // Resume playback
      });
    }
  }, [movie]); // Run whenever the movie source changes

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setRented(false);
      return <span>Rental expired</span>;
    } else {
      return <span>Rental expires in: {hours}h {minutes}m {seconds}s</span>;
    }
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
                      sources: [{ src: movie, type: 'video/mp4' }]
                    }}
                    options={{
                      autoplay: true,
                      controls: ['rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen', 'pip'],
                      settings: ['speed']
                    }}
                    ref={playerRef} // Reference to the Plyr instance
                  />
                  <Box>
                    {
                      user?.subscription === "Premium" || rented ? (
                        <QualitySwitch onClick={() => getTranscodedUrl('1080p')}>
                          1080p
                        </QualitySwitch>
                      ) : (
                        <Popup overlayStyle={{ background: 'rgba(0, 0, 0, .5)' }} trigger={<QualitySwitch>
                        1080p
                      </QualitySwitch>} modal nested>
                          {
                            close => (
                              <Confirmation title={"Upgrade to Premium Plan"} onclick={() => close()} />
                            )
                          }
                        </Popup>
                      )
                    }
                    {
                      user?.subscription === "Standard" || rented ? (
                        <QualitySwitch onClick={() => getTranscodedUrl('720p')}>
                          720p
                        </QualitySwitch>
                      ) : (
                        <Popup overlayStyle={{ background: 'rgba(0, 0, 0, .5)' }} trigger={<QualitySwitch>
                          720p
                        </QualitySwitch>} modal nested>
                            {
                              close => (
                                <Confirmation title={"Upgrade to Standard Plan"} onclick={() => close()} />
                              )
                            }
                          </Popup>
                      )
                    }
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
          {
            rented ? (
              <Timer>
                <Countdown date={rentalExpiration} renderer={renderer} />
              </Timer>
            ) : (
              <GroupWatch onClick={displayRazorpay}>
                <div>
                  <LuFileSignature />
                </div>
              </GroupWatch>
            )
          }
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 250px);
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
  margin-right: 15px;

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

const Timer = styled.div`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
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