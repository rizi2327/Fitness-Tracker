import React, { useState } from 'react'
import styled from 'styled-components'
import { counts } from '../utils/data.jsx';
import CountCard from '../components/Cards/CountCard';
import WeeklyStatCard from '../components/Cards/WeeklyStatCard.jsx';
import CategoryChart from '../components/Cards/CategoryCard.jsx';
import AddWorkout from '../components/AddWorkout.jsx';
import WorkoutCard from '../components/Cards/WorkoutCard.jsx';

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

const Section=styled.div`
display:flex;
flex-direction:column;
padding:0px 16px;
gap:22px;
@media(max-wwidth:600px){
gap:12px;}
`;

const CardWrapper=styled.div`
display:flex;
flex-wrap:wrap;
justify-content:center;
gap:20px;
margin-bottom:100px;
@media (max-width:600px)
{
gap:12px;
}`;

const DashBoard = () => {
  const [workout,setWorkout]=useState("")
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
        "label":"Legs"
      },
      {
        "id":1,
        "value":1500,
        "label":"Back"
      },
      {
        "id":2,
        "value":3750,
        "label":"Shoulder"
      },
      {
        "id":3,
        "value":2250,
        "label":"ABS"
      },
    ]

  }
  return (
    <Container>
        <Wrapper>
            <Title>Dashboard</Title>
            <Flexwrap>
              {counts.map((item)=>(
              <CountCard item={item}  data ={data}/>
              ))}
            </Flexwrap>
            <Flexwrap>
              <WeeklyStatCard data={data}/>
              <CategoryChart data={data}/>
              <AddWorkout workout={workout} setWorkout={setWorkout}/>
            </Flexwrap>
            <Section>
                <Title>Today's Workouts</Title>
                <CardWrapper>
                  <WorkoutCard/>
                  <WorkoutCard/>
                  <WorkoutCard/>
                </CardWrapper>
            </Section>
        </Wrapper>
    </Container>
  )
}

export default DashBoard
