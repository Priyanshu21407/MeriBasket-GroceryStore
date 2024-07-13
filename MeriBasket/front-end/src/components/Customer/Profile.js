import { useEffect, useState } from "react";

import '../../styles/profile.css'

export default function Profile () {
    const [detail,setDetail] = useState();
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

        fetch('http://127.0.0.1:5000/api/ProfileDetails',options)  // API endpoint of your Flask server
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
        <div className="profile-container">
            {detail?
            <div className="profile-details">
                <h2>Profile Details</h2>
                <div className="detail-item">
                <strong>Name:</strong> {detail[0]}
                </div>
                <div className="detail-item">
                <strong>Address:</strong> {detail[1]}
                </div>
                <div className="detail-item">
                <strong>Contact:</strong> {detail[2]}
                </div>
                <div className="detail-item">
                <strong>Email ID:</strong> {detail[3]}
                </div>
                </div>
                : <></>}
        </div>
    )
}