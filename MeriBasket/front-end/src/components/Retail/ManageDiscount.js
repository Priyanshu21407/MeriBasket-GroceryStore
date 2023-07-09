import { useEffect, useState } from "react"

export default function ManageDiscount () {
    const [isChecked,setChecked] = useState();
    const [discData,setDiscData] = useState();

    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({userDetail: sessionStorage.getItem('user')})
    }


    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/Retail/getDiscounts',options)  // API endpoint of your Flask server
        .then(response => response.text())
        .then(data => {
            console.log(data)
            setDiscData(data)
        })
        .catch(error => {
        console.error('Error:', error);
    });
    },[])
    
    const handleChecked = (ele) => {
        setChecked(ele);
    }

    const handlSubmit = (event) => {
        event.preventDefault()
        let {discount_value,discount_prod_id} = document.forms[0]


        console.log(discount_value.value)
        console.log(discount_prod_id.value)

        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({discount_prod_id : discount_prod_id.value,discount_type : isChecked,discount_value: discount_value.value, userDetail : sessionStorage.getItem('user')})
        }

        fetch('http://127.0.0.1:5000/api/Retail/setDiscount',options)  // API endpoint of your Flask server
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
            <h1>Manage Your Discounts</h1>
            <p>Add a deal/discount</p>
            <form onSubmit={handlSubmit}>
            <input type="text" name="discount_value" placeholder="Enter discount value (%)"></input>
            <input type="radio" value="type1" checked={isChecked === 'type1'} onChange={() => handleChecked('type1')} /><label>Discount Type 1</label>
            <input type="radio" value="type2" checked={isChecked === 'type2'} onChange={() => handleChecked('type2')}/><label>Discount Type 2</label>
            <input type ="text" name="discount_prod_id" placeholder="Enter product ID eligible"></input>
            <button type="submit">Add Discount</button>
            </form>
            <div>
                <p>Deals/Discounts Added</p>
                {discData}
            </div>

        </div>
    )
}