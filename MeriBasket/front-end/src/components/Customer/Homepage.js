import { useState } from "react"
export default function Homepage(){
    
    const [results,setResults] = useState(false)
    const[products,setProducts] = useState()

    const fetchProducts = (props) =>{
        let search_query = props.query
        console.log("fetching products...")
        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({search_query})
        }
        
        fetch('http://127.0.0.1:5000/api/Search',options)  // API endpoint of your Flask server
            .then(response => response.json())
            .then(data => {
                setResults(true)
                setProducts(data)
                console.log("data ",products)
                
            })
            .catch(error => {
            console.error('Error:', error);
        });
    }

    const home = (event) =>{
        event.preventDefault()
        let {query} = document.forms[0]
        query=query.value
        console.log(query)
        fetchProducts({query: query})

    }

    const AddtoCart = (ele) => {

        const userDetail = sessionStorage.getItem("user")
        const productDetail = products[ele][1]

        const options = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({userDetail,productDetail})
        }
        
        fetch('http://127.0.0.1:5000/api/addProd',options)  // API endpoint of your Flask server
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
        
    <>
      <h1>Home Page</h1>
      <form onSubmit={home}>
      <input name="query" type="text" placeholder='Search any grocery'></input>
      <button type="submit"> Search</button>
      </form>
      </>
    {results &&
    <>
        <h1>products</h1>
        {products.map((items,index) => (
            <div key={index}>{items}
            <button onClick={() => AddtoCart(index)}>Add to Cart</button>  
            </div>
        ))}
        </>
    }
    </div>
    )
}