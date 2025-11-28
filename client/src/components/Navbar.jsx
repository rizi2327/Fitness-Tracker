import React from 'react'
import styled from 'styled-components';
import LogoImg from '../utils/Images/Logo.png';
import { Link } from 'react-router-dom';
import { MenuRounded } from '@mui/icons-material';

const Nav=styled.div`
background-color:${({theme})=>theme.bg};
height:80px;
display:flex;
align-items:center;
justify-content:center;
font-size:1rem;
position:sticky;
top:0;
z-index:10;
color:white;
border-bottom:1px solid ${({theme})=>theme.text_secondary+20}
 `;
const NavContainer=styled.div`
width:100%;
max-width:1400px;
padding:0 24px;
display:flex;
gap:14px;
align-items:center;
justify-content:space-between;
font-size:1rem;`;
const NavLogo=styled(Link)`
width:100%;
display:flex;
align-items:center;
gap:16px;
padding:0 6px;
font-weight:600;
text-decoration:none;
color:${({theme})=>theme.black}
`;
const Logo=styled.img`
height:42px;
 `;
 const Mobileicon=styled.div`
 color:${({theme})=>theme.text_primary};
 display:none;
 @media screen and (max-width:768px)
 {
 display:flex;
 align-items:center;
 }`;


const Navbar = () => {
  return (
    <Nav>
        <NavContainer>
        <Mobileicon>
          <MenuRounded  sx={{color:"inherit"}}/>
        </Mobileicon>
            <NavLogo to='/'>
                <Logo src={LogoImg} alt='Fittrack Logo' title='Fittrack'/>
                Fittrack 
            </NavLogo>
        </NavContainer>
    </Nav>
  )  
}

export default Navbar
