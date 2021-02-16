import {React, useState} from 'react'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Badge} from 'react-bootstrap'

const nav = () => {
    const countCart = useLocalStorage('cart', 0);
    return (
        <Navbar bg="light">
            <Link href="/"><Navbar.Brand href="/">Shop</Navbar.Brand></Link>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            <Nav>
                <Link href="/cart">
                <Nav.Link href="/cart">Cart <Badge variant="danger">{countCart}</Badge></Nav.Link>
                </Link>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key);
      const item_pares = JSON.parse(item);
      var qty = 0;
      if (item != null) {
          Object.keys(item_pares.items).forEach(function (key_item) {
              qty = qty + item_pares.items[key_item].qty;
          });
      }
      
      return qty ? qty : initialValue;
    } catch (error) {
      // If error also return initialValue
      // console.log(error);
      return initialValue;
    }
  });
    return storedValue;
}

export default nav