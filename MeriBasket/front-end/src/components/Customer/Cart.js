import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import '../../styles/cart.css'


export default function Cart () {
    const [detail,setDetail] = useState([]);
    const [path,setPath] = useState();
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


    const handlePath = (ele) => {

        setPath(ele);
    
      }

    return (
        <div className="cart">
             <h2>Your Cart</h2><br/>
            {detail.length ? (
        <>
          <div className="cart-items">
            {detail.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-name">{item[0]}</div>
                <div className="item-price">Price: ${item[1]}</div>
                <div className="item-quantity">Quantity: {item[2]}</div>
              </div>
            ))}
          </div>
          <div className="checkout">
            <button>Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <div className="empty-cart">Cart is Empty</div>
      )}
        </div>
    )
}