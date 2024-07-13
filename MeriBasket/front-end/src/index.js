import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Homepage,Home, Orders, Profile,Checkout,Cart,ManageOrder,ManageDiscount,AgentHome,AgentOngoing,AgentOrdreq, Header } from './route_export';
import Layout from './components/Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Routes>
        <Route path ="/Customer/Home" element={<Homepage />}/>
        <Route path ="/Customer/Orders" element={<Orders />}/>
        <Route path ="/Customer/Profile" element={<Profile />}/>
        <Route path ="/Customer/Checkout" element={<Checkout />}/>
        <Route path ="/Customer/Cart" element={<Cart />}/>
        <Route path ="/Retail/Home" element={<Home />}/>
        <Route path ="/Retail/Orders" element={<ManageOrder />}/>
        <Route path ="/Retail/Discounts" element={<ManageDiscount />}/>
        <Route path ="/Agent/Home" element={<AgentHome />}/>
        <Route path ="/Agent/OrderRequest" element={<AgentOrdreq />}/>
        <Route path ="/Agent/OngoingDelivery" element={<AgentOngoing />}/>
        <Route path ="/" element={<Header/>}/>

      </Routes>
    <App />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
