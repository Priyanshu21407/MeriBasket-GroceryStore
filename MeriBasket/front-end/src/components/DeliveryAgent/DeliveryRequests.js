import { useEffect, useState } from "react"

export default function AgentOrdreq () {
    
    const [orderReqDetail, setDetail] = useState();

    useEffect(()=>{

        fetchdata()
    
    },[]);

    const fetchdata = async () => {
        const userDetail = sessionStorage.getItem("user")
        console.log("details ",userDetail)
        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail})
        }

        await fetch('http://127.0.0.1:5000/api/Agent/Requests',options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
            console.log("data ",data)
            setDetail(data)
            console.log(orderReqDetail)

        })
        .catch(error => {
        console.error('Error:', error);
    });
    }

    const handleReq = (ele) => {
        const userDetail = sessionStorage.getItem("user")
        console.log("userr",userDetail)
        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail: userDetail, request_id: ele.deliveryID,action: ele.status })
        }
        fetch('http://127.0.0.1:5000/api/Agent/Request_action',options)  // API endpoint of your Flask server
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
            <h1> Delivery Requests </h1>
            <div>
            {orderReqDetail!=null ?  <>{orderReqDetail.map((item,index) => (
                <div key={index}><>From: </>{item[1]}<br></br><>To: </>{item[2]}
                <div>
                <button name = "Accept" onClick={() => handleReq({status: "Accept", deliveryID: item[0]})}> Accept </button>
                <button name = "Reject" onClick={() => handleReq({status : "Reject", deliveryID: item[0]})}> Reject </button>
            </div>
                <br></br>
                </div>
            ))}</> : <>No orders</>}
            </div>
        </div>
    )
}