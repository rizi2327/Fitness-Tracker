import React from 'react'
import styled from 'styled-components'
import WorkoutCard from '../components/Cards/WorkoutCard';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendar} from "@mui/x-date-pickers";
const Container=styled.div`
flex:1;
height:100%;
display:flex;
justify-content:center;
padding:22px 0px;
overflow-y:scroll;
`;

const Wrapper=styled.div`
flex:1;
max-width:1600px;
padding:0px 16px;
display:flex;
gap:16px;
@media (max-width:600px)
{
gap:12px;
flex-direction:column;
}
`;

const Left=styled.div`
flex:0.3;
height:fit-content;
padding:18px;
border:1px solid ${({theme})=>theme.text_primary};
border-radius:14px;
margin-bottom:20px;
box-shadow:1px 4px 8px 0px ${({theme})=>theme.text_secondary};
position:sticky;
top:20px;
@media(max-width:600px)
{
position:static;
flex:1;
}
`;
const Title=styled.div`
font-weight:600;
font-size:16px;
color: ${({theme})=>theme.primary};
margin-bottom:12px;
@media(max-width:600px)
{
font-size:14px;
}`;

const Right=styled.div`
flex:0.7;
display:flex;
flex-direction:column
@media(max-width:600px)
{
flex:1;
}
`;

const Section=styled.div`
display:flex;
flex-direction:column;
padding:0px 16px;
gap:22px;
@media(max-width:600px)
{
gap:12px;
}
`;

const SectionTitle=styled.div`
font-weight:600;
font-size:22px;
color: ${({theme})=>theme.text_primary};
margin-bottom:10px;
`;

const CardWrapper=styled.div`
display:flex;
flex-wrap:wrap;
justify-content:flex-start;
gap:20px;
margin-bottom:100px;
@media(max-width:600px)
{
gap:12px;
justify-content:center;
}
`;

const Workouts = () => {
  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DateCalendar/>
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SectionTitle>Today's Workout</SectionTitle>
            <CardWrapper>
              <WorkoutCard/>
              <WorkoutCard/>
              <WorkoutCard/>
              <WorkoutCard/>
            </CardWrapper>
          </Section>
        </Right>
      </Wrapper>
    </Container>
  )
}

export default Workouts
