import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Cart () {
    const [detail,setDetail] = useState([]);
    useEffect(()=>{
        const userDetail = sessionStorage.getItem("user")
        console.log("details ",userDetail)
        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail})
        }

        fetch('http://127.0.0.1:5000/api/cart',options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
        console.log("data ",data)
        setDetail(data)
        })
        .catch(error => {
        console.error('Error:', error);
    });
    },[]);

    return (
        <div>
            your cart<br/>
            {detail.length ? <>{detail.map((item,index) => (
                <div key={index}>{item}
                </div>
            ))}<br></br><NavLink to="/Checkout">Place order</NavLink></>: <>Cart is Empty</>}
            
        </div>
    )
}