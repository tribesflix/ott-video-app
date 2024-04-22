import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { db, storage } from '../../lib/firebase';
import { deleteObject, ref } from 'firebase/storage';

const BannerItem = ({ banner, setBanners }) => {

    const deleteBanner = async (id, name) => {
        const confirmation = confirm("Are you sure you want to delete this?");
        if (confirmation) {
          await deleteDoc(doc(db, "banners", id));
          const storageRef =  ref(storage, `banners/${name}`);
          await deleteObject(storageRef);
          setBanners((prevBanners) => prevBanners.filter((item) => item.id !== id));
        }
    }

    return (
        <Box>
            <Div>
                <Img src={banner.bannerURL} alt={banner.id} />
            </Div>
            <Delete onClick={() => deleteBanner(banner.id, banner.bannerName)}>Delete</Delete>
        </Box>
    )
}

const Div = styled.div`
    width: 320px;
    height: 180px;
    border-radius: 10px;
    border: 1px solid black;
`;

const Box = styled.div`
    position: relative;
`;

const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;


const Delete = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #d11a2a;
  font-size: 14px;
  padding: 7px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
`;

export default BannerItem;
