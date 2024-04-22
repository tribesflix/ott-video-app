import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { db } from '../../lib/firebase';

const UserItem = ({ user, setUsers }) => {

    const deleteUser = async (id) => {
        const confirmation = confirm("Are you sure you want to delete this?");
        if (confirmation) {
            await deleteDoc(doc(db, "users", id));
            setUsers((prevUsers) => prevUsers.filter((item) => item.id !== id));
        }
    }

    return (
        <Box>
            <Img src={user.photo} alt={user.name} />
            <Text>{user.name}</Text>
            <Text>Free Plan</Text>
            <Text>{user.type}</Text>
            <Delete onClick={() => deleteUser(user.id)}>Delete</Delete>
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

const Img = styled.img`
  border-radius: 50px;
  height: 40px;
  width: 40px;
  margin-right: 20px;
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

export default UserItem;