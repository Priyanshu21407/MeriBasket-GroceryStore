import { useEffect,useState } from "react"


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
        <div>

            Your Orders
            {detail.length? <>{detail.map((items,index) => (
                <div key={index}>{items}
                </div>
            ))}</> : <>No orders</>}
        </div>
    )
}