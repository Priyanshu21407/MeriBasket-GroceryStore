import { useEffect, useState } from "react"

export default function ManageOrder () {
    
    const [req_orderDetail,set_req_OrderDetail] = useState();
    const [completed_orderDetail,set_completed_OrderDetail] = useState();

    useEffect(() => {
        const userDetail = sessionStorage.getItem("user");

        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail})
        }
        fetch('http://127.0.0.1:5000/api/Retail/Orders',options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
            console.log("data ",data)
            set_req_OrderDetail(data[0])
            set_completed_OrderDetail(data[1])
            console.log("orders",req_orderDetail,completed_orderDetail)
        })
        .catch(error => {
        console.error('Error:', error);
    });

    },[])

    const handleReq = (ele) => {

        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail: sessionStorage.getItem('user'), orderID: ele.orderID,opt: ele.status })
        }
        fetch('http://127.0.0.1:5000/api/Retail/OrderAccept',options)  // API endpoint of your Flask server
        .then(response => response.text())
        .then(data => {
            window.alert(data)
        })
        .catch(error => {
        console.error('Error:', error);
    });
        

    }

    return (
        <div>
            Manage Your Order
            
           {req_orderDetail ? req_orderDetail.map((item) => (
            <div>
                <p>Order id {item[0]}</p>
                {item[1].map(ele =>(
                <div>{ele}</div>
            ))}
            <div>
                <button name = "Accept" onClick={() => handleReq({status: "Accept", orderID: item[0]})}> Accept </button>
                <button name = "Reject" onClick={() => handleReq({status : "Reject", orderID: item[0]})}> Reject </button>
            </div>
            </div>
           )): <div>No Order</div>}
            
           {completed_orderDetail ? completed_orderDetail.map((item) => (
            <div>
                <p>Order id {item[0]}</p>
                {item[1].map(ele =>(
                <div>{ele}</div>
            ))}
            </div>
           )): <div>No Order</div>}
            
        </div>
    )
}