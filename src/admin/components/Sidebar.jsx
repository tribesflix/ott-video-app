import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { selectUserName, selectUserPhoto, setSignOutState, setUserLoginDetails } from '../../features/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { MdDashboard } from "react-icons/md";
import { FaCloudUploadAlt, FaUsers } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { GoCodeReview } from "react-icons/go";

const Sidebar = ({ openSideBar, setOpenSideBar }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

    const handleSignOut = async () => {
        if(username) {
        auth.signOut().then(() => {
            dispatch(setSignOutState());
            navigate('/');
        }).catch((err) => console.error(err.message));
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, user => {
        if(user) {
            setUser(user);
        }
        });
    }, [username]);

    const setUser = (user) => {
        dispatch(
            setUserLoginDetails({
                id: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            })
        );
    }

    return (
        <Nav opensidebar={openSideBar.toString()}>
          <Link to='/'>
          <Logo>
              <img src="/images/tribesflix.png" alt="Disney+" />
          </Logo>
          </Link>
          <NavMenu>
            <Link to="/super-admin/dashboard">
              <MdDashboard />
              Dashboard
            </Link>
            <Link to={"/super-admin/upload"}>
              <FaCloudUploadAlt />
              Uploads
            </Link>
            <Link to={"/super-admin/users"}>
              <FaUsers />
              Users
            </Link>
            <Link to={"/super-admin/banners"}>
              <CiCreditCard1 />
              Banners
            </Link>
            <Link to={"/super-admin/editors"}>
              <GoCodeReview />
              Editors
            </Link>
          </NavMenu>
          <SignOut>
            <UserImg src={userPhoto} alt={username}  />
            <DropDown>
                <span onClick={handleSignOut}>Sign Out</span>
            </DropDown>
          </SignOut>
        </Nav>
    )
}

const Nav = styled.nav`
  width: 270px;
  height: 100vh;
  background-color: #090b13;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  transition: all 0.3s ease-out;
  z-index: 50;

  @media screen and (max-width: 768px) {
    left: ${props => props.opensidebar === "true" ? '0' : '-150%'};
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

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  justify-content: center;
  margin: 0px;
  padding: 0px 20px;
  position: relative;
  width: 100%;

  a {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 10px 20px;
    font-size: 16px;
    background-color: white;
    border-radius: 10px;
    color: black;
    transition: all 0.1s ease-out;

    &:active {
      background-color: rgba(0,115,255,0.1);
      color: blue;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    margin: 50px 0;
    height: auto;
  }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-top: 100px;

  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

export default Sidebar;