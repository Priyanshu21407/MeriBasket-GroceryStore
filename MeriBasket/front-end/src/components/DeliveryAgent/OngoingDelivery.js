import { useEffect, useState } from "react"

export default function AgentOngoing () {

    const [deliveryOngoing, setdeliveryOngoing] = useState();

    useEffect(() => {
        fetchdata();
    },[])

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

        await fetch('http://127.0.0.1:5000/api/Agent/Ongoing',options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
            console.log("data ",data)
            setdeliveryOngoing(data)
            console.log(deliveryOngoing)

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
            body : JSON.stringify({userDetail: userDetail, delivery_id: ele.deliveryID,action: ele.status })
        }
        fetch('http://127.0.0.1:5000/api/Agent/Ongoing_action',options)  // API endpoint of your Flask server
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
            <h1> Ongoing Deliveries </h1>
            <div>
            {deliveryOngoing!=null ?  <>{deliveryOngoing.map((item,index) => (
                <div key={index}><>Delivery ID: </>{item[0]}<br></br><> Started at: </>{item[1]}<br></br><>Status: </>{item[2]}
                <div>
                <button name = "Done" onClick={() => handleReq({status: "Done", deliveryID: item[0]})}> Done </button>
            </div>
                <br></br>
                </div>
            ))}</> : <>No Deliveries Ongoing</>}
            </div>
        </div>
    )
}