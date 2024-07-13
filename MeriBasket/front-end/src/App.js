import logo from './logo.svg';
import './styles/App.css';
import {useState , useEffect} from 'react';
import {Routes, Route, NavLink, Navigate} from 'react-router-dom'
import { Header } from './route_export';

import generateRoutes from './routes';

import Login from './components/Customer/Login';

function App() {

  const [isLogin,setLogin] = useState(false);
  const [useCase, setUsecase] = useState('Customer');
  const [path,setPath] = useState();

  console.log("login status: ", isLogin)


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
    
    {isLogin ? 
    <div className = 'navlinks'>
      <Header useCase={useCase} handleLogout={handleLogout} handlePath={handlePath} />

    </div>
    :
    <>
<div class='login-form'>

    <form onSubmit={handleLogin}>
  
      <p class = "p">  Login<br></br> as {useCase === 'Customer' ? <>Customer</>: useCase ==='RetailOutlet'? <>Retail Outlet</>: <>Delivery Agent</> }</p>
      <br></br>
      

      <button class = "usecase" name = "Customer" onClick={() => handleUsecase('Customer')} ><label>Customer</label></button>
      <button class = "usecase" name = "RetailOutlet" onClick={() => handleUsecase('RetailOutlet')} ><label>Retail Outlet</label></button> 
      <button class = "usecase" name = "DeliveryAgent" onClick={() => handleUsecase('DeliveryAgent')} ><label>Delivery Agent</label></button> 


      <br></br>
      <br></br>
   
      <br></br>
      

      <input type="text" name="uid" placeholder='Enter User ID'/>
      <br></br>
 
      <br></br>
      <input type="password" name="password" placeholder='Enter Password' />
      <br></br>
      <button class= "login" type="submit">Login</button>

    </form>
</div>
    </>
     }
     <Navigate to={path}/>
   </div>
  );
}

export default App;
