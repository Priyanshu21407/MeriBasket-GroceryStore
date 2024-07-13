import { useEffect, useState } from "react"
import '../../styles/checkout.css'

export default function Checkout () {

    const [payment,setPayment] = useState();
    const [isChecked, setChecked] = useState('cod');
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

        fetch('http://127.0.0.1:5000/api/Checkout',options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
        console.log("data ",data)
        setDetail(data)
        })
        .catch(error => {
        console.error('Error:', error);
    });
    },[]);


    const handleOption = (ele) => {
        setChecked(ele)
    }

    const handlePayment = () => {


        console.log("placed")
        const userDetail = sessionStorage.getItem("user")
        console.log("details ",userDetail)
        const paymentOption = isChecked ==='cod'? 1:2
        console.log("pay opt ",paymentOption)
        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail,paymentOption})
        }

        fetch('http://127.0.0.1:5000/api/post_order',options)
        .then(response => response.text())
        .then(data => {
            console.log("data ",data)
            window.alert(data)
        })
        .catch(error => {
        console.error('Error:', error);
    });
        
    }

    return (
        <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="payment-options">
        <input
          type="radio"
          id="cod"
          value="cod"
          name="payment"
          checked={isChecked === 'cod'}
          onChange={() => handleOption('cod')}
        />
        <label htmlFor="cod">Cash on Delivery</label>
        <input
          type="radio"
          id="card"
          value="card"
          name="payment"
          checked={isChecked === 'card'}
          onChange={() => handleOption('card')}
        />
        <label htmlFor="card">Card</label>
      </div>
      <div className="payment-details">
        <p>Payment Type: {isChecked === 'cod' ? 'C.O.D.' : 'Card'}</p>
        {isChecked === 'card' && (
          <div className="card-details">
            <div><strong>Name:</strong> {detail[1]}</div>
            <div><strong>Card Number:</strong> {detail[2]}</div>
            <div><strong>CVV:</strong> {detail[3]}</div>
          </div>
        )}
      </div>
      <button className="proceed-button" onClick={handlePayment}>Proceed</button>
    </div>
    )
}