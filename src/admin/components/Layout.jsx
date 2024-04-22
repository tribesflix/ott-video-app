import React from 'react';
import Sidebar from './Sidebar';
import { styled } from 'styled-components';
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useState } from 'react';

const Layout = ({ children }) => {

  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <Div>
      <Sidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
      <MobileNav onClick={() => setOpenSideBar(!openSideBar)}>
        <HiBars3BottomLeft />
      </MobileNav>
      <main>
          { children }
      </main>
    </Div>
  )
}

const Div = styled.div`
  background-color: white;
  width: 100%;
`;

const MobileNav = styled.button`
  color: black;
  border-radius: 50px;
  font-size: 25px;
  display: none;
  position: fixed;
  top: 70px;
  left: 30px;
  border: none;
  outline: none;
  z-index: 99;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export default Layout;