import styled, {ThemeProvider} from "styled-components"
import { lightTheme } from "./utils/Themes";
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Dashboard } from "@mui/icons-material";
import DashBoard from "./pages/DashBoard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";


const Container = styled.div`
width:100%;
height:100vh;
display:flex;
flex-direction:column;
background:${({theme})=>theme.bg};
color:${({theme})=>theme.text_primary};
overflow-x:hidden;
overflow-y:hidden;
transition:all 0.2s ease`

function App() {

  const [user,setUser]=useState(true) 
  return (
    <>
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
      {user ? (
        <Container>
          <Navbar/>
         <Routes>
           <Route path="/" element={<DashBoard/>}/>
           <Route path="/workouts" element={<Workouts/>}/>
           <Route path="/tutorials" element={<Tutorials/>}/>
           <Route path="/blogs" element={<Blogs/>}/>
           <Route path="/contact" element={<Contact/>}/>
         </Routes>
        </Container>
      ):(
     <Container>
        <Authentication/>
      </Container>
      )}
      
      </BrowserRouter>
    </ThemeProvider>
    </>
  )
}

export default App
