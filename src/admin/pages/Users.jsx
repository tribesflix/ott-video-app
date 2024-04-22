import React from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import UserItem from '../components/UserItem';

const Users = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch(err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
        <Container>
            <Box>
                <Heading>
                    Current Subscribers & Users
                </Heading>
            </Box>
            <CurrentUsers>
              {
                users.map(user => (
                  <UserItem key={user.id} user={user} setUsers={setUsers} />
                ))
              }
            </CurrentUsers>
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

const CurrentUsers = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 10px;
  height: 80vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Heading = styled.h2`
  color: #090b13;
`;

export default Users;