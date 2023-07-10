import logo from './logo.svg';
import './App.css';
import {useState , useEffect} from 'react';
import {Routes, Route, NavLink, Navigate} from 'react-router-dom'

import generateRoutes from './routes';

import Login from './components/Customer/Login';
import Homepage from './components/Customer/Homepage';
import Orders from './components/Customer/Orders';
import Profile from './components/Customer/Profile';
import Checkout from './components/Customer/Checkout';
import Cart from './components/Customer/Cart';
import Home from './components/Retail/Home';
import ManageOrder from './components/Retail/ManageOrder';
import ManageDiscount from './components/Retail/ManageDiscount';
import AgentHome from './components/DeliveryAgent/Home';
import AgentOrdreq from './components/DeliveryAgent/DeliveryRequests';
import AgentOngoing from './components/DeliveryAgent/OngoingDelivery';

function App() {

  const [isLogin,setLogin] = useState(false);
  const [useCase, setUsecase] = useState('Customer');
  const [path,setPath] = useState();


  const handleLogin = (event) => {
    event.preventDefault();
    let {uid,password} = document.forms[0]
    Login({uid: uid.value, pass: password.value, type: useCase});
    if (sessionStorage.getItem('user')){
      setLogin(true);
      useCase === 'Customer' ? handlePath('/Customer/Home') : useCase === 'RetailOutlet' ? handlePath('/Retail/Home') : handlePath('/Agent/Home');
    }
  }

  const handleLogout = () => {

    sessionStorage.removeItem('user');
    setLogin(false);
    handlePath('/');

  }

  const handleUsecase = (ele) => {
    
    setUsecase(ele);
  
  }

  const handlePath = (ele) => {

    setPath(ele);

  }

  return (
   <div className='App'>
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
      </Routes>
    <Navigate to={path}/>
    {isLogin ? 
    <div>
      {useCase === 'Customer'? 
      <div>
      <NavLink onClick={handleLogout}>Logout </NavLink>
      <NavLink to="/Customer/Profile" onClick={() => handlePath("/Customer/Profile")}> Profile </NavLink>
      <NavLink to="/Customer/Orders" onClick={() => handlePath("/Customer/Orders")}> Orders </NavLink>
      <NavLink to="/Customer/Cart" onClick={() => handlePath("/Customer/Cart")}> Cart </NavLink>
      </div>
      :
      useCase === 'RetailOutlet' ? 
      <div>
      <NavLink onClick={handleLogout}>Logout </NavLink>
      <NavLink to="/Retail/Home" onClick={() => handlePath("/Retail/Home")}> Home </NavLink>
      <NavLink to="/Retail/ManageOrder" onClick={() => handlePath("/Retail/Orders")}> Manage Orders </NavLink>
      <NavLink to="/Retail/ManageDiscount" onClick={() => handlePath("/Retail/Discounts")}> Manage Discounts </NavLink>
      </div>
      :
      <div>
      <NavLink onClick={handleLogout}>Logout </NavLink>
      <NavLink to="/Agent/Home" onClick={() => handlePath("/Agent/Home")}> Home </NavLink>
      <NavLink to="/Agent/OrderRequest" onClick={() => handlePath("/Agent/OrderRequest")}> Order Requests </NavLink>
      <NavLink to="/Agent/OngoingDelivery" onClick={() => handlePath("/Agent/OngoingDelivery")}> Ongoing Deliveries </NavLink>
      </div>
      }
    </div>
    :
<div>
    <form onSubmit={handleLogin}>
      <h1>Welcome to MeriBasket</h1>
      <br></br>
      <p> Login as {useCase === 'Customer' ? <>Customer</>:<>Retail Outlet</> }</p>
      <br></br>
      <input type="radio" checked = {useCase === 'Customer'} name = "Customer" onChange={() => handleUsecase('Customer')} /><label>Customer</label>
      <input type="radio" checked = {useCase === 'RetailOutlet'} name = "RetailOutlet" onChange={() => handleUsecase('RetailOutlet')} /><label>Retail Outlet</label> 
      <input type="radio" checked = {useCase === 'DeliveryAgent'} name = "DeliveryAgent" onChange={() => handleUsecase('DeliveryAgent')} /><label>Delivery Agent</label> 
      <br></br>
      <br></br>
      User ID
      <br></br>
      <input type="text" name="uid" placeholder='Enter User ID'/>
      <br></br>
      Password
      <br></br>
      <input type="password" name="password" placeholder='Enter Password' />
      <br></br>
      <button type="submit">Login</button>
    </form>
</div>
     }
   </div>
  );
}

export default App;
