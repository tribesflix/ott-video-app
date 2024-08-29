import React from "react";
import styled from "styled-components";
import { FaXmark } from "react-icons/fa6";
import NavContent from "./NavContent";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

const Navbar = ({ openNav, setOpenNav, adminRoute, setAdminRoute }) => {

  const { user } = useContext(AuthContext);

  return (
    <Nav opennav={openNav.toString()}>
        <XMark onClick={() => setOpenNav(false)}>
          <FaXmark />
        </XMark>
        <Logo>
            <img src="/images/tribesflix.png" alt="TribesFlix" />
        </Logo>
        {
          user ? (
            <NavContent setOpenNav={setOpenNav} adminRoute={adminRoute} setAdminRoute={setAdminRoute} />
          ) : (
            <Login href={'/signup'}>Signup</Login>
          )
        }
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;

  @media (max-width: 768px) {
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    top: ${props => props.opennav === "true" ? '0' : '-150%'};
    transition: all 0.3s ease-out;
  }
`;

const XMark = styled.button`
  display: none;

  @media (max-width: 768px) {
    background: transparent;
    outline: none;
    border: none;
    font-size: 27px;
    color: #ffffff;
    align-self: flex-end;
    position: absolute;
    right: 40px;
    top: 40px;
    display: block;
  }
`;

const Logo = styled.a`
  padding: 0;
  width: 150px;
  margin-top: 4px;
  max-height: 100px;
  font-size: 0;
  display: inline-block;

  img {
    display: block;
    width: 100%;
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

export default Navbar;