import { useState } from "react";
import groceryIcon from '../../assets/logoGroceries.jpg'
import '../../styles/Customer.css';

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
    <div class = "home">
        
    <>
      <div className="home-container">
        <h1 className="welcome-text">Welcome Back!</h1>
        <form className="search-form" onSubmit={home}>
          <input className="search-input" name="query" type="text" placeholder="Search any grocery ..." />
          <button className="search-button" type="submit">Search</button>
        </form>
      </div>
    </>
    {results &&
    <div class = "products">
        <h1>products</h1>
        <div className="product-list">
            {products.map((item, index) => {
            return (
                <div key={index} className="product-item">
                  <img src={groceryIcon} alt="Grocery" className="product-image" />
                  <div className="product-details">
                    <h3 className="product-name">{item[1]}</h3>
                    <p className="product-stock">Stock: {item[2]}</p>
                    <p className="product-price">Price: ${item[3]}</p>
                    <p className="product-rating">Rating: {item[4]}/10</p>
                    <button onClick={() => AddtoCart(index)} className="add-to-cart-button">Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    }
    </div>
    )
}