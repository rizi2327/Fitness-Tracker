import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { counts } from '../utils/data.jsx';
import CountCard from '../components/Cards/CountCard';
import WeeklyStatCard from '../components/Cards/WeeklyStatCard.jsx';
import CategoryChart from '../components/Cards/CategoryCard.jsx';
import AddWorkout from '../components/AddWorkout.jsx';
import WorkoutCard from '../components/Cards/WorkoutCard.jsx';
import { addWorkout,getWorkouts,getDashboradData } from '../api/index.js';

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
  const [loading,setLoading]=useState(false);
  const [buttonLoading,setButtonLoading]=useState(false);
  const [data,setData]= useState({});
  const [todaysWorkouts,setTodaysWorkouts]=useState([]);
  const [workout,setWorkout]=useState(`#legs
    -back squat
    -5 setsX15 reps
    -50 kg
    -10 min
    `);

    const dashboardData= async()=>{
      setLoading(true);
      const token = localStorage.getItem('fittrack-app-token');
      console.log("TOKEN =>", token);
      try {
        const res = await getDashboradData(token);
        setData(res.data ?? {});
        console.log(res.data);
      } catch (err) {
        console.error('dashboardData error', err);
      } finally {
        setLoading(false);
      }
    }

    const addNewWorkout=async() => {
      setButtonLoading(true);
      const token = localStorage.getItem('fittrack-app-token');
      try {
        await addWorkout(token, { workoutString: workout });
        await dashboardData();
        await getTodaysWorkout();
      } catch (err) {
        console.error('addNewWorkout error', err);
        alert(err.response?.data?.message || err.message || 'Something went wrong');
      } finally {
        setButtonLoading(false);
      }
    };

  const getTodaysWorkout = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getWorkouts(token, "");
      // server returns `todayWorkouts` (no 's') so fall back safely
      setTodaysWorkouts(res?.data?.todayWorkouts ?? []);
      console.log(res.data);
    } catch (err) {
      console.error('getTodaysWorkout error', err);
      setTodaysWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(()=>{
      dashboardData();
      getTodaysWorkout();
    },[])

  return (
    <Container>
        <Wrapper>
            <Title>Dashboard</Title>
            <Flexwrap>
              {counts.map((item,index)=>(
              <CountCard key={item.id ||index} item={item}  data ={data}/>
              ))}
            </Flexwrap>
            <Flexwrap>
              <WeeklyStatCard data={data}/>
              <CategoryChart data={data}/>
              <AddWorkout workout={workout} setWorkout={setWorkout}
              addNewWorkout={addNewWorkout}
              buttonLoading={buttonLoading}/>
            </Flexwrap>
            <Section>
                <Title>Today's Workouts</Title>
                <CardWrapper>
                {todaysWorkouts.map((workout,index)=>{
                 return <WorkoutCard key={index} workout={workout}/>
})}
                  
                </CardWrapper>
            </Section>
        </Wrapper>
    </Container>
  )
}

export default DashBoard
