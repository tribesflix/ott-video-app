import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import BannerItem from '../components/BannerItem';
import Spinner from '../../components/Spinner';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const bannersSnapshot = await getDocs(query(collection(db, "banners"), orderBy("createdAt", "desc")));
                const bannersData = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBanners(bannersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if(banner) {
            uploadBanner();
        }
    }, [banner])

    const uploadBanner = async () => {
        if (!banner) return;
        const storageRef = ref(storage, `banners/${banner.name}`);

        try {
            setLoading(true);
            await uploadBytes(storageRef, banner);
            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, "banners"), {
                bannerName: banner.name,
                bannerURL: downloadURL,
                createdAt: serverTimestamp()
            });

            setBanner(null);
            const bannersSnapshot = await getDocs(query(collection(db, "banners"), orderBy("createdAt", "desc")));
            const bannersData = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBanners(bannersData);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (event) => {
        setBanner(event.target.files[0]);
    };

    return (
        <Layout>
            {
                loading && (<Spinner />)
            }
            <Container>
                <Box>
                    <Heading>
                        Upload Banners
                    </Heading>
                    <div>
                        <FileInput type='file' id='banner' name='banner' accept='image/*' onChange={handleFileChange} />
                        <FileInputLabel htmlFor='banner'>New Banner</FileInputLabel>
                    </div>
                </Box>
                <UploadedBanners>
                    {
                        banners.map(banner => (
                            <BannerItem key={banner.bannerURL} banner={banner} setBanners={setBanners} />
                        ))
                    }
                </UploadedBanners>
            </Container>
        </Layout>
    )
}

const Container = styled.div`
  padding: 20px 60px;
  padding-left: 300px;
  height: 100vh;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileInputLabel = styled.label`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 18px;
  padding: 10px 20px;
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

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const Heading = styled.h2`
  color: #090b13;
`;

const UploadedBanners = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 10px;
  height: 80vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

export default Banners;
