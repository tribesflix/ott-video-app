import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import PlanItem from '../components/PlanItem';

const Plans = () => {

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const plansQuery = query(collection(db, 'plans'), orderBy('amount', 'asc'));
                const usersSnapshot = await getDocs(plansQuery);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPlans(usersData);
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
                        Subscription Plans
                    </Heading>
                </Box>
                <CurrentPlans>
                    {
                        plans.map(plan => (
                            <PlanItem key={plan.id} plan={plan} setPlans={setPlans} />
                        ))
                    }
                </CurrentPlans>
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

const CurrentPlans = styled.div`
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


export default Plans;