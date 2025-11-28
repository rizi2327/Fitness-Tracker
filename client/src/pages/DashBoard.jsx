import React from 'react'
import styled from 'styled-components'
import { counts } from '../utils/data.jsx';
import CountCard from '../components/Cards/CountCard';
import WeeklyStatCard from '../components/Cards/WeeklyStatCard.jsx';

const Container=styled.div`
flex:1;
height:100%;
display:flex;
justify-content:center;
padding:22px 0px;
overflow-y:scroll;`;
const Wrapper=styled.div`
flex:1;
max-width:1400px;
display:flex;
flex-direction:column;
gap:22px;
@media (max-width:600px){
gap:12px;
}
`;
const Title=styled.div`
font-size:22px;
padding:0 16px;
color:${({theme})=>theme.text_primary};
font-weight:500;`;

const Flexwrap=styled.div`
display:flex;
flex-wrap:wrap;
justify-content:space-between;
gap:22px;
padding:0px 16px;
@media (max-width:600px){
gap:12px}
`;
const DashBoard = () => {
  const data={
    "totalCaloriesBurnt":13000,
    "totalWorkouts":6,
    "avgCaloriesBurntPerWorkout":2250,
    "totalWeeksCaloriesBurnt":
    {
      "weeks":[
      "17th",
      "18th",
      "19th",
      "20th",
      "21th",
      "22th",
      "23th",
    ],
    "CaloriesBurned":[
      10500,
      0,
      0,
      0,
      0,
      0,
      10500,
    ]
    },
    "pieChartData":[
      {
        "id":0,
        "value":6000,
        "lable":"Legs"
      },
      {
        "id":1,
        "value":1500,
        "lable":"Back"
      },
      {
        "id":2,
        "value":3750,
        "lable":"Shoulder"
      },
      {
        "id":3,
        "value":2250,
        "lable":"ABS"
      },
    ]

  }
  return (
    <Container>
        <Wrapper>
            <Title>Dashboard</Title>
            <Flexwrap>
              {counts.map((item)=>(
              <CountCard item={item}/>
              ))}
            </Flexwrap>
            <Flexwrap>
              <WeeklyStatCard data={data}/>
            </Flexwrap>
        </Wrapper>
    </Container>
  )
}

export default DashBoard
