import React, { useState, useContext } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// import NameForm from '../components/Member'
// import * as Cookie from 'js-cookie';
// import cookies from 'next-cookies'

const QUERY_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      img
    }
  }
`

// const ADD_TO_CART = gql`
//   mutation ADD_TO_CART(
//     $id = ID!
//     ){
//       addToCart(
//         pid: $id
//       ) {
//       id
//     }
//   }
// `



const Home = () => {
  // const {data, loading, error} = useQuery(QUERY_PRODUCTS, {
  //   pollInterval : 30000
  // })
  const {data, loading, error} = useQuery(QUERY_PRODUCTS)
  if (error) return <p>Oops.. somthing went wrong, please try again later.</p>
  if (loading) return <p>Loading...</p>

  // const [addToCart, {loading, error}] = useMutation(ADD_TO_CART,{
  //   onCompleted: data => {
  //     console.log(data);
  //   }
  // })

  // const [className, setClassName] = useState("")

  //   const myClick = () => {
  //       setClassName("some-class")
  //   }
  const handleAddToCart = (id, name, img, price) => {
    // console.log(id, name, img, price);


    if(JSON.parse(localStorage.getItem('cart')) == null){
      var item = {
        amount: 0,
        vat: 0,
        items: [],
      }
      localStorage.setItem('cart', JSON.stringify(item))
    }

    const oldItems = JSON.parse(localStorage.getItem('cart'));
    var item = {
      amount: 0,
      vat: 0,
      items: [],
    }

    var checkID = false;

    //add old item
    var amount = 0
    var vat = 0
    Object.keys(oldItems.items).forEach(function (key) {
      // console.log(key); // key
      // console.log('--- old item ---');
      if (oldItems.items[key].id == id) {
        oldItems.items[key].qty = oldItems.items[key].qty + 1
        item.items.push(oldItems.items[key]);
        checkID = true;
      }else{
        item.items.push(oldItems.items[key]);
      }
      amount = amount + (parseInt(oldItems.items[key].price) * parseInt(oldItems.items[key].qty));
      vat = vat + (((parseInt(oldItems.items[key].price) * parseInt(oldItems.items[key].qty)) * 7) / 100) ;
    });

    //add new item
    if (!checkID) {
      var newItems = {
        'id': id,
        'name': name,
        'img': img,
        'price': price,
        'qty': 1
      }

      amount = amount + parseInt(price);
      vat = vat + ((parseInt(price) * 7) / 100) ;

      item.items.push(newItems);
    }

    item.amount = amount;
    item.vat = vat;

    // console.log('--- Item ---');
    // console.log(item);
    localStorage.setItem('cart', JSON.stringify(item));

  }

  


  return (
    <div style={{
      display: 'flex',
      maxWidth: '1280px',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: '40px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '40px',
    }}>



      {data.products.map(prod => (
        <div
         key={prod.id}
         style={{
            display:'flex',
            flexDirection:'column',
            margin: '10px'
         }}>
          <Link href='/products/[productId]' as={`/products/${prod.id}`}>
            <a>
                <img src={prod.img} alt={prod.name} width='300px' style={{borderRadius: '5px'}} />
            </a>
          </Link>
          <h4>{prod.name}</h4>
          <h5>฿{prod.price}</h5>
          <button 
            style={{
              background:'#342f2f',
              color: "#fff",
              padding: 10,
              cursor: 'pointer',
              alignItems: 'center',
              border: 'none',
              borderRadius: '5px'
            }}
            onClick={() => handleAddToCart(prod.id, prod.name, prod.img, prod.price)}
          >Add to Cart</button>
        </div>
      ))}
    </div>
  )
}


export default Home


