import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { LoadingContext } from "../contexts/LoadingContext";
import Loader from "../components/Loader";

const Signup = () => {

  const { user, createUser, setCreateUser, handleGoogleSignup, handleManualSignup } = useContext(AuthContext);
  const { loading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState(false);

  useEffect(() => {
    if(user) {
      navigate('/home');
    }
  }, [user]);

  return (
    <Container>
      {
        loading &&  <Loader />
      }
      <Content>
        <CTA>
          <CTALogoOne src="/images/tribesflix.png" alt="TribesFlix" />
          <SignUp onClick={handleGoogleSignup}>
            <Google src="/images/google.png" alt="G" />
            Continue with Google
          </SignUp>
          <Description>
            Or
          </Description>
          <div>
            <Input type="text" placeholder="Name" name="name" value={createUser.name} onChange={(e) => setCreateUser({...createUser, [e.target.name]: e.target.value})} required />
            <Input type="email" placeholder="Email" name="email" value={createUser.email} onChange={(e) => setCreateUser({...createUser, [e.target.name]: e.target.value})} required />
            <div style={{ position: 'relative' }}>
              <Input type={password ? 'text': 'password'} placeholder="Password" name="password" value={createUser.password} onChange={(e) => setCreateUser({...createUser, [e.target.name]: e.target.value})} required />
              <button onClick={() => setPassword(!password)} style={{ background: 'transparent', outline: 'none', border: 'none', position: 'absolute', right: '10px', top: '15px', cursor: 'pointer' }}>
                {
                  password ? (
                    <IoIosEye style={{ color: '#d3d3d3', fontSize: '1.5rem'}} />
                  ) : (
                    <IoIosEyeOff style={{ color: '#d3d3d3', fontSize: '1.5rem'}} />
                  )
                }
              </button>
            </div>
            <SignUp type="submit" onClick={handleManualSignup}>SIGN UP</SignUp>
          </div>
          <Description>
            Already have an account? <Link to={'/'}>Login</Link>
          </Description>
        </CTA>
        <BgImage />
      </Content>
    </Container>
  );
};

const Container = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
`;

const Content = styled.div`
  margin-bottom: 10vw;
  width: 100%;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 40px;
  height: 100%;
`;

const BgImage = styled.div`
  height: 100%;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("/images/login-background.jpg");
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
`;

const CTA = styled.div`
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CTALogoOne = styled.img`
  margin: 12px auto;
  max-width: 200px;
  min-height: 1px;
  display: block;
  width: 100%;
`;

const Input = styled.input`
  font-weight: bold;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.6);
  margin-bottom: 12px;
  width: 100%;
  letter-spacing: 1.5px;
  font-size: 18px;
  padding: 16.5px 10px;
  border: 1px solid white;
  border-radius: 4px;
`;

const Google = styled.img`
  max-height: 25px;
  max-width: 25px;
`;

const SignUp = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  margin-bottom: 12px;
  width: 100%;
  letter-spacing: 1.5px;
  font-size: 18px;
  padding: 16.5px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

const Description = styled.p`
  color: hsla(0, 0%, 95.3%, 1);
  font-size: 11px;
  margin: 0 0 24px;
  line-height: 1.5;
  letter-spacing: 1.5px;
`;

const CTALogoTwo = styled.img`
  max-width: 600px;
  margin-bottom: 20px;
  display: inline-block;
  vertical-align: bottom;
  width: 100%;
`;

export default Signup;