import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState } from "react";

const ImgSlider = () => {

  const [banners, setBanners] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const bannersSnapshot = await getDocs(collection(db, "banners"));
          const bannersData = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBanners(bannersData);
        } catch(err) {
          console.error(err);
        }
      }
  
      fetchData();
    }, []);
  
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <Carousel {...settings}>
      {
        banners.map(banner => (
          <Wrap>
            <a>
              <img src={banner.bannerURL} alt={banner.id} />
            </a>
          </Wrap>
        ))
      }
    </Carousel>
  );
};

const Carousel = styled(Slider)`
  margin-top: 20px;

  & > button {
    opacity: 0;
    height: 100%;
    width: 5vw;
    z-index: 1;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s ease 0s;
    }
  }

  ul li button {
    &:before {
      font-size: 10px;
      color: rgb(150, 158, 171);
    }
  }

  li.slick-active button:before {
    color: white;
  }

  .slick-list {
    overflow: initial;
  }

  .slick-prev {
    left: -75px;
  }

  .slick-next {
    right: -75px;
  }
`;

const Wrap = styled.div`
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  a {
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    cursor: pointer;
    display: block;
    position: relative;
    padding: 4px;
    width: 100%;
    height: 330px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      padding: 0;
      border: 4px solid rgba(249, 249, 249, 0.8);
      transition-duration: 300ms;
    }

    @media screen and (max-width: 768px) {
      height: 150px;
    }
  }
`;

export default ImgSlider;