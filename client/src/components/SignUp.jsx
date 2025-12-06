import React from 'react'
import styled from 'styled-components';
import TextInput from "./TextInput";
import Button from "./Button";
import SingIn from './SingIn';


const Container=styled.div`
width:100%;
flex-direction:column;
gap:36px;
`;
const Title=styled.div`
font-size:30px;
font-weight:800;
color:${({theme})=>theme.text_primary};
`;
const Span=styled.div`
font-size:16px;
font-weight:400;
color:${({theme})=>theme.text_secondary+90};`;   
const SignUp = () => {
  return (
    <>
      <Container>
        <div>
            <Title>Create New Account</Title>
            <Span>Please enter your details to signup</Span>
        </div>
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:"20px"
        }}>
            {/* ✅ Correct prop name: label */}
            <TextInput 
            label="Full Name"
            placeholder="Enter your full name"/>
            
            <TextInput 
            label="Email Address"
            placeholder="Enter your email"/>
            
            <TextInput 
            label="Password"
            placeholder="Enter your password"
            password/>
            <Button text="SignIn"/>
        </div>
      </Container>
    </>
  )
}
 
export default SignUp
