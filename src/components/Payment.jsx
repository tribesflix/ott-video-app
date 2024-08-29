import React, { useContext } from 'react';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import styled from 'styled-components';
import PricingCard from './PricingCard';
import { useState } from 'react';
import { useEffect } from 'react';

const Payment = () => {

  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);

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

  const displayRazorpay = async (plan) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`, 
      amount: plan.amount * 100,
      currency: 'INR',
      name: 'Tribesflix',
      description: 'Subscription Payment',
      image: 'https://i.postimg.cc/wMVZwWkB/tribesflix.png',
      handler: async function (response) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);
        await updateDoc(doc(db, 'users', user?.uid), {
          subscription: plan.name
        });
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

  const fetchPlans = async () => {
    try {
      const plansQuery = query(collection(db, 'plans'), orderBy('amount', 'asc'));
      const planData = await getDocs(plansQuery);
      const plansArray = planData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(plansArray);
    } catch (error) {
      console.log("Error fetching plans", error);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <PricingContainer>
        {
            plans.map((plan, index) => (
              <PricingCard key={index} title={plan.name} price={plan.amount} features={plan.features} onclick={() => displayRazorpay(plan)} />
            ))
        }
    </PricingContainer>
  );
};

const PricingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
}
`;

export default Payment;
