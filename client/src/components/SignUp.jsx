import React, { useState } from 'react'
import styled from 'styled-components';
import TextInput from "./TextInput";
import Button from "./Button";
import { useDispatch } from 'react-redux';
import { UserSignUp } from '../api';
import { loginSuccess } from '../redux/reducer/userSlice';



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

  const dispatch = useDispatch();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [loading,setLoading]=useState(false);
  const [buttonDisabled,setButtonDisabled]=useState(false);
  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };


  const  handleSignUp=async()=>{
    setLoading(true);
    setButtonDisabled(true);
    if(validateInputs())
    {
      await UserSignUp({name,email,password})
      .then((res)=>{
        dispatch(loginSuccess(res.data));
        alert('Account created success');
        setLoading(false);
        setButtonDisabled(false)
      })
      .catch((err)=>{
        alert(err.response?.data?.message|| "something went wrong")
        setLoading(false);
        setButtonDisabled(false);
      })
    }
  }

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
            placeholder="Enter your full name"
            value={name}
            handelChange={(e)=>setName(e.target.value)}/>
            
            <TextInput 
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            handelChange={(e)=>setEmail(e.target.value)}/>
            
            <TextInput 
            label="Password"
            placeholder="Enter your password"
            password
            value={password}
            handelChange={(e)=>setPassword(e.target.value)}/>
            <Button text="SignUp"
            onClick={handleSignUp}
            isLoading={loading}
            isDisabled={buttonDisabled}
            type="primary"
            full/>
        </div>
      </Container>
    </>
  )
}
 
export default SignUp
