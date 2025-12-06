  import React, { useState } from 'react'
import styled from 'styled-components'
import TextInput from './TextInput';
import Button from './Button';
import { UserSignIn } from '../api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/reducer/userSlice';
  const Container= styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;`;
  const Title= styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};`;
  const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
  `;


  const SingIn = () => {
    const dispatch= useDispatch()
    const [email,setEmail]=useState('');
    const [loading,setLoading]= useState(false);
    const [buttonDisabled,setButtonDisabled]=useState(false)
    const [password,setPassword]=useState('');
    const validateInputs = ()=>{
      if(!email || !password)
      {
        alert('Please fill in all Fields');
        return false;
      }
      return true;
    }

    const handleSignIn = async()=>{
      setLoading(true);
      setButtonDisabled(true);
      if(validateInputs()){
        await UserSignIn({email,password})
        .then((res)=>{
          dispatch(loginSuccess(res.data));
          alert("Login success");
          setLoading(false);
          setButtonDisabled(false);
        })
        .catch((err)=>
        {
          alert(err.response?.data?.message|| "something went wrong");
          setLoading(false);
          setButtonDisabled(false);
        })
      }
    }
    return (
     <Container>
      <div>
        <Title>Welcome to Fittrack 👋</Title>
        <Span>Please login with your details here</Span>
      </div>
      <div style={{
        display:'flex',
        gap:'20px',
        flexDirection:'column'
      }}>
        <TextInput
        label="Email address"
        placeholder="Enter Your email address"
        value={email}
        handelChange={(e)=>setEmail(e.target.value)}/>
        <TextInput
        label="Password"
        placeholder="Enter Your password"
        value={password}
        handelChange={(e)=>setPassword(e.target.value)}/>
        <Button
        text="SignIn"
        onClick={handleSignIn}
        isLoading={loading}
        isDisabled={buttonDisabled}
        type="primary"
        full/>
      </div>
     </Container>
    )
  }
  
  export default SingIn
  