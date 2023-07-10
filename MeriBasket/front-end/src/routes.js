import React from 'react';
import { Routes, Route } from 'react-router';
import Homepage from './components/Customer/Homepage';
import Orders from './components/Customer/Orders';
import Profile from './components/Customer/Profile';
import Checkout from './components/Customer/Checkout';
import Cart from './components/Customer/Cart';
import Home from './components/Retail/Home';
import ManageOrder from './components/Retail/ManageOrder';
import ManageDiscount from './components/Retail/ManageDiscount';


const generateRoutes = () => {
    <Routes>
        <Route path ="/Customer/Home" element={<Homepage />}/>
        <Route path ="/Customer/Orders" element={<Orders />}/>
        <Route path ="/Customer/Profile" element={<Profile />}/>
        <Route path ="/Customer/Checkout" element={<Checkout />}/>
        <Route path ="/Customer/Cart" element={<Cart />}/>
        <Route path ="/Retail/Home" element={<Home />}/>
        <Route path ="/Retail/Orders" element={<ManageOrder />}/>
        <Route path ="/Customer/Discounts" element={<ManageDiscount />}/>
      </Routes>
}

export default generateRoutes;