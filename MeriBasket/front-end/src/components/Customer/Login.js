import { useState } from "react"

export default function Login (props) {
    
    let uid=props.uid
    let pass=props.pass

    console.log("uid ",props.type)
    
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({uid,pass})
    }
    
    let url='';

    if (props.type === 'Customer'){
        url = ('http://127.0.0.1:5000/api/login')
    }
    else if (props.type === 'RetailOutlet'){
        url = ('http://127.0.0.1:5000/api/Retail/Login')
    }
    else{
        url = ('http://127.0.0.1:5000/api/Agent/Login')
    }

    fetch(url,options)  // API endpoint of your Flask server
        .then(response => response.json())
        .then(data => {
        console.log("data ",data)
        if(data.length>0){
            sessionStorage.setItem("user",data)
        }
        console.log(sessionStorage.getItem("user"))
        })
        .catch(error => {
        console.error('Error:', error);
    });
    
}


