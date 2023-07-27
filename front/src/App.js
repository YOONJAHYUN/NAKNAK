import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from "recoil";
// import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Getfish from './Getfish';
import NotFound from './NotFound';
import Fishing from './Fishing';
import Login from './account/Login';
import Dogam from './account/Dogam';
import Signup from './account/Signup';
import Fishpic from './fishing/Fishpic';



// import { useNavigate } from 'react-router-dom';
// button onClick={() => navigate('/')}>Go Root</button>

function App(props) {
	
  return (
	<RecoilRoot>
		<div className='App' style={{
      margin: 'auto',
    //   width: '80%',
    }}>
			<BrowserRouter>
				{/* <Header style={{
              margin:'auto',
             }}/> */}
				<Routes style={{
              margin:'auto',
             }}>
					<Route path="/" element={<Home />}></Route>
					<Route path="/fishing" element={<Fishing />}></Route>
					<Route path="/Fishpic" element={<Fishpic />}></Route>
					<Route path="/Login" element={<Login />}></Route>
					<Route path="/Signup" element={<Signup />}></Route>
					<Route path="/Dogam" element={<Dogam />}></Route>
					<Route path="/Getfish" element={<Getfish />}></Route>
					
					{/* <Route path="/product/:productId" element={<Login />}></Route> */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
				<Footer/>
			</BrowserRouter>
		</div>
		</RecoilRoot>
  );
}

export default App;