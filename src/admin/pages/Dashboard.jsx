import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { FaCloudUploadAlt, FaUsers } from 'react-icons/fa';
import { GoCreditCard } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

Chart.register(
  ArcElement, 
  Tooltip, 
  Legend
);

const Dashboard = () => {

  const [numberedData, setNumberedData] = useState({
    users: 0,
    uploads: 0,
    banners: 0
  });

  const [personData, setPersonData] = useState({
    admin: 0,
    user: 0,
    editor: 0
  });

  const [contentData, setContentData] = useState({
    movies: 0,
    series: 0
  });

  useEffect(() => {
    const fetchData = async () => {
    try {
      const usersDocs = await getDocs(collection(db, "users"));
      const uploadsDocs = await getDocs(collection(db, "movies"));
      const bannersDocs = await getDocs(collection(db, "banners"));

      setNumberedData({
        ...numberedData,
        users: usersDocs.docs.length,
        uploads: uploadsDocs.docs.length,
        banners: bannersDocs.docs.length
      });

      const usersSnapshot = usersDocs.docs.filter(doc => doc.data().type === "user");
      const editorsSnapshot = usersDocs.docs.filter(doc => doc.data().type === "editor");
      const adminSnapshot = usersDocs.docs.filter(doc => doc.data().type === "admin");

      setPersonData({
        ...personData,
        admin: adminSnapshot.length,
        user: usersSnapshot.length,
        editor: editorsSnapshot.length
      });

      const moviesSnapshot = uploadsDocs.docs.filter(doc => doc.data().type === "movie");
      const seriesSnapshot = uploadsDocs.docs.filter(doc => doc.data().type === "series");

      setContentData({
        ...contentData,
        movies: moviesSnapshot.length,
        series: seriesSnapshot.length
      });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  fetchData();
  }, []);

  const barData = {
    labels: ["Movies", "Series"],
    datasets: [{
      label: "Content",
      data: [contentData.movies, contentData.series],
      backgroundColor: ["#0063e5", "#5294b3"],
      borderColor: ["#0063e5", "#5294b3"]
    }]
  }

  const doughnutData = {
    labels: ["Users", "Editors", "Admin"],
    datasets: [{
      label: "People",
      data: [personData.user, personData.editor, personData.admin],
      backgroundColor: ["#5294b3", "#0063e5", "#99cfe8"],
      borderColor: ["#5294b3", "#0063e5", "#99cfe8"]
    }]
  }

  return (
    <Layout>
      <Container>
        <Box>
            <Heading>
                Overview
            </Heading>
        </Box>
        <DashboardContain>
          <NumberedData>
            <DataContainer>
              <FaUsers />
              <div>
                <p>USERS</p>
                <strong>{numberedData.users}</strong>
              </div>
              <ViewAllBtn>
                <Link to={'/super-admin/users'}>View All</Link>
              </ViewAllBtn>
            </DataContainer>
            <DataContainer>
              <FaCloudUploadAlt />
                <div>
                  <p>UPLOADS</p>
                  <strong>{numberedData.uploads}</strong>
                </div>
              <ViewAllBtn>
                <Link to={'/super-admin/upload'}>View All</Link>
              </ViewAllBtn>
            </DataContainer>
            <DataContainer>
              <GoCreditCard />
                <div>
                  <p>BANNERS</p>
                  <strong>{numberedData.banners}</strong>
                </div>
              <ViewAllBtn>
                <Link to={'/super-admin/banners'}>View All</Link>
              </ViewAllBtn>
            </DataContainer>
          </NumberedData> 
          <ChartData>
            <ChartWrapper>
              <BarContainer>
                <Bar data={barData} />
              </BarContainer>
            </ChartWrapper>
            <ChartWrapper>
              <DoughnutContainer>
                <Doughnut data={doughnutData} />
              </DoughnutContainer>
            </ChartWrapper>
          </ChartData> 
        </DashboardContain>
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

const DashboardContain = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 15px;
  height: 80vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const NumberedData = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const DataContainer = styled.article`
  height: 150px;
  width: 300px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background-color: whitesmoke;
  color: black;
  display: flex;
  align-items: start;
  padding-top: -20px;
  padding: 20px 30px;
  gap: 20px;
  position: relative;

  svg {
    font-size: 40px;
    color: gray;
    margin-top: 20px;
  }

  div {
    display: flex;
    flex-direction: column;

    p {
      color: gray;
      padding: 0;
    }

    strong { 
      font-weight: semibold;
      font-size: 25px;
      margin-top: -12px;
    }
  }
`;

const ViewAllBtn = styled.div`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 13px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;

  &:hover {
    background-color: #0483ee;
  }
`;

const ChartData = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 70px;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    gap: 20px;
  }

`;

const ChartWrapper = styled.div`
  width: 45%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const BarContainer = styled.div`
  height: 300px;
`;

const DoughnutContainer = styled.div`
  height: 300px;
`;

const Heading = styled.h2`
  color: #090b13;
  text-align: center;
  width: 100%;
`;


export default Dashboard;
