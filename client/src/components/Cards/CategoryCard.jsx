import { Padding } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';
// import { BarChart } from '@mui/icons-material';
import React from 'react'
import styled from 'styled-components';

const Card=styled.div`
flex:1;
min-width:280px;
padding:24px;
border:1px solid ${({theme})=>theme.text_primary};
border-radius:14px;
box-shadow:1px 6px 20px 0px ${({theme})=>theme.text_secondary};
display:flex;
flex-direction:column;
gap:6px;
@media (max-width: 600px)
{
padding:16px;
}
`;
const Title=styled.div`
font-weight:600;
font-size:16px;
color:${({theme})=>theme.primary};
@media(max-width:600px){
font-size:14px;
}`;

const CategoryChart = ({data}) => {
  return (
    <Card>
      <Title>Weekly Calories Burned</Title>
      {data?.pieChartData && (
        <PieChart
        series={[{
            data:data?.pieChartData,
            innerRadius:30,
            outerRadius:140,
            paddingAngle:5,
            cornerRadius:5,
        }]}
        slotProps={{
            legend:{
                direction:'row',
                position:{vertical:'bottom',horizontal:'middle'},
                padding:0,
                labelStyle:{
                    fontSize:'12px',
                }
            }
        }}
        height={300}
        />
      )}
    </Card>
  )
}

export default CategoryChart
