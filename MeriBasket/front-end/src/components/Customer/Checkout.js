import { useEffect, useState } from "react"

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

        fetch('http://127.0.0.1:5000/api/post_order',options)  // API endpoint of your Flask server
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
        <div>
            <div>Checkout</div>
            <input type="radio" id="cod" value="cod" name="cod" checked={isChecked === 'cod'} onChange={() => handleOption('cod')} />
            <label>Cash on Delivery</label>
            <input type="radio" id="card" value="card" name="card" checked={isChecked === 'card'} onChange={() => handleOption('card')}/>
            <label>Card</label>
            <div>
            <br></br>
            <br></br>
            Payment Type: 
            </div>
            <br></br>
            <div>{isChecked === 'cod' ?
            <div>
                C.O.D.
            </div> : 
            <div>
                Card Details: 
                <div>
                    <div>Name {detail[1]}</div>
                    <div>Card Number {detail[2]}</div>
                    <div>CVV {detail[3]}</div>
                </div>
            </div>}</div>
            <button onClick={handlePayment}>Proceed</button>
        </div>
    )
}