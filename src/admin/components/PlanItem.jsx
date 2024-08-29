import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { db } from '../../lib/firebase';
import Popup from 'reactjs-popup';
import { FaArrowCircleLeft } from 'react-icons/fa';

const PlanItem = ({ plan, setPlans }) => {

    const [amount, setAmount] = useState(plan.amount);
    const closeRef = useRef(null);

    const deletePlan = async (id) => {
        const confirmation = confirm("Are you sure you want to delete this?");
        if (confirmation) {
            await deleteDoc(doc(db, "plans", id));
            setPlans((prevPlans) => prevPlans.filter((item) => item.id !== id));
        }
    }

    const updatePlan = async (id, event) => {
        event.preventDefault();
        try {
            closeRef.current.click();
            await updateDoc(doc(db, 'plans', id), {
                amount
            });
        } catch (error) {
            console.error("Error updating amount", error);
        }
    }

    return (
        <Box>
            <Text>{plan.name} Plan</Text>
            <Text style={{ color: '#0063e5'}}>INR {plan.amount}</Text>
            <Div>
                <Popup
                    trigger={<ViewDetails>Edit</ViewDetails>}
                    closeOnDocumentClick={false}
                    closeOnEscape={false}
                    modal
                    nested
                >
                    {(close) => (
                        <Modal>
                            <MenuBar>
                                <CloseBtn
                                    onClick={() => {
                                        close();
                                    }}
                                    ref={closeRef}
                                >
                                <FaArrowCircleLeft />
                                </CloseBtn>
                                <Description>Edit Content</Description>
                            </MenuBar>
                            <UploadForm method="post">
                                <InputGroup>
                                    <Label>Change Price</Label>
                                    <Input
                                        name="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="number"
                                    />
                                </InputGroup>
                                <Delete onClick={() => close()}>Cancel</Delete>
                                <SubmitButton onClick={(e) => updatePlan(plan.id, e)}>Update Changes</SubmitButton>
                            </UploadForm>
                        </Modal>
                    )}
                </Popup>
                {/* <Delete onClick={() => deletePlan(plan.id)}>Delete</Delete> */}
            </Div>
        </Box>
    )
}

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #090b13;
  padding: 5px 20px;
`;

const Div = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewDetails = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 14px;
  padding: 7px 15px;
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

const Text = styled.h2`
  color: #090b13;
  font-size: 16px;
  width: 30%;
`;

const Delete = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #d11a2a;
  font-size: 14px;
  padding: 7px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Modal = styled.div`
  width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  background: url("/images/home-background.png") center center / cover;
  border-radius: 12px;
  border: 2px solid rgb(249, 249, 249);
  margin: auto;
  margin-top: 30px;
  padding: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    width: auto;
    margin: auto 13px;
  }
`;

const MenuBar = styled.div`
  width: 100%;
  padding: 4px 12px;
  border-bottom: 2px solid #f9f9f9;
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: #f9f9f9;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: rgb(249, 249, 249);
  font-size: 22px;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #f9f9f9;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background-color: #0063e5;
  color: #f9f9f9;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;


export default PlanItem;