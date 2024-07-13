import React from 'react';
import {Routes, Route, NavLink, Navigate} from 'react-router-dom'
import '../styles/header.css'

function Header({ useCase, handleLogout, handlePath }) {
  return (
    <div className='navlinks'>
      {useCase === 'Customer' ? (
        <div >
            <NavLink  onClick={handleLogout}>Logout </NavLink>
            <NavLink  to="/Customer/Profile" onClick={() => handlePath("/Customer/Profile")}> Profile </NavLink>
            <NavLink  to="/Customer/Orders" onClick={() => handlePath("/Customer/Orders")}> Orders </NavLink>
            <NavLink  to="/Customer/Cart" onClick={() => handlePath("/Customer/Cart")}> Cart </NavLink>
            <NavLink  to="/Customer/Home" onClick={() => handlePath("/Customer/Home")}> Home </NavLink>
            <NavLink  to="/Customer/Checkout" onClick={() => handlePath("/Customer/Checkout")}> Checkout </NavLink>
        </div>
      ) : useCase === 'RetailOutlet' ? (
        <div>
            <NavLink onClick={handleLogout}>Logout </NavLink>
            <NavLink to="/Retail/Home" onClick={() => handlePath("/Retail/Home")}> Home </NavLink>
            <NavLink to="/Retail/ManageOrder" onClick={() => handlePath("/Retail/Orders")}> Manage Orders </NavLink>
            <NavLink to="/Retail/ManageDiscount" onClick={() => handlePath("/Retail/Discounts")}> Manage Discounts </NavLink>
      </div>
      ) : useCase === 'Agent' ? (
        <div>
            <NavLink onClick={handleLogout}>Logout </NavLink>
            <NavLink to="/Agent/Home" onClick={() => handlePath("/Agent/Home")}> Home </NavLink>
            <NavLink to="/Agent/OrderRequest" onClick={() => handlePath("/Agent/OrderRequest")}> Order Requests </NavLink>
            <NavLink to="/Agent/OngoingDelivery" onClick={() => handlePath("/Agent/OngoingDelivery")}> Ongoing Deliveries </NavLink>
      </div>
      ) : 
      <div class="welcome">
      <h1>Meri Basket</h1>
      </div>
      }
    </div>
  );
}

export default Header;
