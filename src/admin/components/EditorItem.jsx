import { doc, updateDoc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { db } from '../../lib/firebase';

const EditorItem = ({ editor, setEditors }) => {

    const removeEditor = async (id) => {
        const confirmation = confirm("Are you sure you want to remove this editor?");
        if (confirmation) {
            await updateDoc(doc(db, "users", id), {
                type: "user"
            });
            setEditors((prevEditors) => prevEditors.filter((item) => item.id !== id));
        }
    }

    return (
        <Box>
            <Img src={editor.photo} alt={editor.name} />
            <Text>{editor.name}</Text>
            <Text>Free Plan</Text>
            <Text>{editor.type}</Text>
            <Delete onClick={() => removeEditor(editor.id)}>Remove</Delete>
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

export default EditorItem;