import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRef } from 'react';
import EditorItem from '../components/EditorItem';

const Editors = () => {

    const [editors, setEditors] = useState([]);
    const [editor, setEditor] = useState(null);
    const closeRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "users")),
            (snapshot) => {
              const editors = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((data) => data.type === "editor");
              setEditors(editors);
            }
        );
      
        return unsubscribe;
    }, []);

    const addEditor = async (event, email) => {
        event.preventDefault();
    
        try {
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const userSnapshot = await getDocs(userQuery);
    
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userId = userDoc.id;
    
                await updateDoc(doc(db, "users", userId), {
                    type: "editor"
                });
    
                const editorDocs = await getDocs(collection(db, "users"));
                const editorsArray = editorDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((data) => data.type === "editor");
                setEditors(editorsArray);
                closeRef.current.click();

            } else {
                console.log("User not found with email:", email);
            }
        } catch (error) {
            console.error('Error updating user type:', error);
        }
    };
    

    return (
        <Layout>
            <Container>
                <Box>
                    <Heading>
                        Editors
                    </Heading>
                    <Popup trigger={<NewUpload>Add Editor</NewUpload>} closeOnDocumentClick={false} closeOnEscape={false} modal nested>
                    {
                        close => (
                        <Modal>
                            <MenuBar>
                                <CloseBtn ref={closeRef} onClick={() => {close();}}>
                                    <FaArrowCircleLeft />
                                </CloseBtn>
                                <Description>Add Editor</Description>
                            </MenuBar>
                            <FormContainer>
                                <InputGroup>
                                    <Label>Editor Email</Label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={editor}
                                        onChange={(e) => setEditor(e.target.value)}
                                        required
                                    />
                                </InputGroup>
                                <SubmitButton onClick={(e) => addEditor(e, editor)}>Add Editor</SubmitButton>
                                <Delete onClick={() => close()}>Cancel</Delete>
                            </FormContainer>
                        </Modal>
                        )
                    }
                    </Popup>
                </Box>
                <CurrentUsers>
                  {
                    editors.map(editor => (
                      <EditorItem key={editor.id} editor={editor} setEditors={setEditors} />
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

const NewUpload = styled.button`
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

const Heading = styled.h2`
  color: #090b13;
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

const FormContainer = styled.form`
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


export default Editors;
