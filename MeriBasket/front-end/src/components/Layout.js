import React from "react";
import Header from "./header.js";
import { Outlet} from 'react-router-dom'




function Layout()
{
    
    return(
        <div className="w-screen">
            <Header/>
            <Outlet/>
        </div>
    )
}

export default Layout