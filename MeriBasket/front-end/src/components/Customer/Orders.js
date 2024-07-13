import { useEffect,useState } from "react"
import '../../styles/orders.css'

export default function Orders () {

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

        fetch('http://127.0.0.1:5000/api/Orders',options)  // API endpoint of your Flask server
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
        <div className="orders-container">
      <h2>Your Orders</h2>
      {detail.length ? (
        detail.map((order, index) => (
          <div key={index} className="order">
            <h3>Order ID: {order[0]}</h3>
            <p>Status: {order[1] === 0 ? "Pending" : "Completed"}</p>
            <div className="order-items">
              {order.slice(2).map((item, itemIndex) => (
                <div key={itemIndex} className="order-item">
                  <p><strong>Product ID:</strong> {item[0]}</p>
                  <p><strong>Product Name:</strong> {item[1]}</p>
                  <p><strong>Quantity:</strong> {item[2]}</p>
                  <p><strong>Price:</strong> ${item[3].toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No orders</p>
      )}
    </div>
    )
}