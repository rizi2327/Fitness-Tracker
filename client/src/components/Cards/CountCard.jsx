import { Container } from '@mui/material'
import React from 'react'
import styled from 'styled-components';

const Card=styled.div``;
const Left=styled.div``;
const Right=styled.div``;
const CountCard = () => {
  return (
    <Card>
        <Left>
            L
        </Left>
        <Right>
            R
        </Right>
    </Card>
  )
}

export default CountCard
