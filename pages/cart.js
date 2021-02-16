import {React, useState, Component, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Row, Col, Card, Breadcrumb, Table, Form, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'


const CHECKOUT_ORDER = gql`
    mutation addOrderShop($subtotal: Float!, $vat: Float!, $total: Float! ){
    addOrderShop( subtotal: $subtotal, vat: $vat, total: $total) {
        id
    }
}
`


const CHECKOUT_ORDER_LIST = gql`
    mutation addOrderList($pid: ID!, $qty: Int!, $price: Float!, $order_id: ID!, $vat: Float! ){
        addOrderList( pid: $pid, qty: $qty, price: $price, order_id: $order_id, vat: $vat) {
        id
    }
}
`


const Cart = () => {
    const router = useRouter()

    const [addOrderShop, {loading, error}] = useMutation(CHECKOUT_ORDER, {
        onCompleted: data => {
            // console.log(data.addOrderShop.id);
            if (data.addOrderShop.id != null) {
                const json = localStorage.getItem('cart')
                const cart = JSON.parse(json)
                const itemToCheckout = cart.items;
                Object.keys(itemToCheckout).forEach(function (key_item) {
                    // console.log(itemToCheckout[key_item]);
                    let vat_list = (parseInt(itemToCheckout[key_item].price) * 7) / 100;
                    addOrderList({variables: {pid:itemToCheckout[key_item].id, qty: itemToCheckout[key_item].qty, price: itemToCheckout[key_item].price, order_id: data.addOrderShop.id, vat: vat_list}})
                });
                // console.log('test');
                localStorage.removeItem("cart")
            }else{
                console.log('data retuen is null');
            }

        }
    });

    const [addOrderList] = useMutation(CHECKOUT_ORDER_LIST, {
        onCompleted: data => {
            // console.log(data);
        }
    });


    const handleCHECKOUT = async () => {

        // console.log(this.state.cart);
        const json = localStorage.getItem('cart')
        if (json != null) {
            const cart = JSON.parse(json)
            // console.log(cart);
            
            
            const vatToCheckout = cart.vat;
            const subtotalToCheckout = cart.amount;
            const totalToCheckout = subtotalToCheckout + vatToCheckout;
            
            
            
            await addOrderShop({variables: {subtotal:subtotalToCheckout, vat: vatToCheckout, total: totalToCheckout}})
            setCartQty(null)
            router.push('/')
        }else{
            console.log('not items');
        }
    }
    useEffect(() => {
        
    })


    const listItems = useLocalStorage('cart', null);
    // console.log(listItems);
    if (listItems != null) {
        var vatOrder = listItems.vat;
        var subtotalOrder = listItems.amount;
    }else{
        var vatOrder = 0;
        var subtotalOrder = 0;
    }
    const totalOrder = vatOrder + subtotalOrder;
    // console.log(listItems);

    const [cartQty, setCartQty] = useState(listItems ? listItems.items : null);
    const [cartVat, setCartVat] = useState(listItems ? listItems.vat : null);
    const [cartSubTotal, setCartSubTotal] = useState(listItems ? listItems.amount : null);
    const [cartTotal, setCartTotal] = useState(listItems ? (listItems.vat + listItems.amount) : null);

    const increaseQuantity = index => {
        const currentItems = [...cartQty];
        currentItems[index].qty += 1;
        // localStorage.setItem('cart', JSON.stringify(currentItems));
        setCartQty(currentItems);
      };
    
      const decreaseQuantity = index => {
        const currentItems = [...cartQty];
    
        if (currentItems[index].qty > 1) {
          currentItems[index].qty -= 1;
        //   localStorage.setItem('cart', JSON.stringify(currentItems));
          setCartQty(currentItems);
        }
      };

      useEffect(() => {
        const json = localStorage.getItem('cart')
        if (json != null) {
            listItems.items = cartQty
            var amount = 0
            var vat = 0
            Object.keys(listItems.items).forEach(function (key) {
              amount = amount + (parseInt(listItems.items[key].price) * parseInt(listItems.items[key].qty));
              vat = vat + (((parseInt(listItems.items[key].price) * parseInt(listItems.items[key].qty)) * 7) / 100) ;
            });
    
            listItems.amount = amount
            listItems.vat = vat
            setCartVat(listItems.vat)
            setCartSubTotal(listItems.amount)
            setCartTotal((listItems.vat + listItems.amount))
            localStorage.setItem('cart', JSON.stringify(listItems));
        }
       })


    return (
        <div>

        <Breadcrumb>
            <Link href="/"><Breadcrumb.Item href="/">Shop</Breadcrumb.Item></Link>
            <Breadcrumb.Item active>Cart</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{
            display: 'flex',
            // gridTemplateColumns: '1fr 1fr 1fr 1fr',
            maxWidth: '80%',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: '40px',
            marginLeft: '10%',
            marginRight: '10%',
            marginBottom: '40px',
            
        }}>
            <Container style={{maxWidth: '100%'}}>
                <Row>
                    <Col xs={8}>
                    <Card className="text-left" style={{marginTop: '8%'}}>
                        <Card.Body>
                        <Card.Title> Cart Items</Card.Title>
                        <Card.Text>
                        <Form.Group>
                            <Table responsive>
                                <thead>
                                    <tr style={{textAlign:'center'}}>
                                    <th></th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {listItems && listItems.items instanceof Array && listItems.items.map((prod, i) => (
                                    <tr style={{textAlign:'center'}}>
                                        <td><img src={prod.img} style={{width: '50px'}} /></td>
                                        <td>{prod.name}</td>
                                        <td>
                                            <div style={{display: 'flex', justifyContent:'center'}}>
                                                <button type="button" style={{border: "0 solid #e2e8f0"}} onClick={() => decreaseQuantity(i)} ><span >−</span></button>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Normal text" 
                                                    disabled 
                                                    value={prod.qty}
                                                    style={{
                                                        textAlign: 'center', 
                                                        display: 'flex', 
                                                        width: '30%',
                                                        border: "0 solid #e2e8f0"
                                                    }} 
                                                />
                                                <button type="button" style={{border: "0 solid #e2e8f0"}} onClick={() => increaseQuantity(i)}><span >+</span></button>
                                            </div>
                                        </td>
                                        <td style={{textAlign:'right'}}>{prod.price * prod.qty}</td>
                                    </tr>
                                    ))}
                                    

                                </tbody>
                            </Table>
                        </Form.Group>
                        </Card.Text>
                        <Card.Text>
                            {/* <small className="text-muted">Last updated 3 mins ago</small> */}
                        </Card.Text>
                        </Card.Body>
                    </Card>

                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Cart Totals</Card.Title>
                                <Card.Text>
                                Cart Total
                                <Form.Group>
                                    <Table responsive>
                                        <tbody>
                                            <tr>
                                                <td>Subtotal</td>
                                                <td style={{textAlign: "right"}}>{subtotalOrder}</td>
                                            </tr>
                                            <tr>
                                                <td>vat 7%</td>
                                                <td style={{textAlign: "right"}}>{vatOrder}</td>
                                            </tr>
                                            <tr style={{fontSize:'24px'}}>
                                                <td>Total</td>
                                                <td style={{textAlign: "right"}}>{totalOrder}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Form.Group>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body style={{textAlign: 'center'}}>
                                <Button variant="primary" size="lg" onClick={() => handleCHECKOUT()}>
                                {loading ? 'Processiong..' : 'PROCEED TO CHECKOUT'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>

        </div>
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
        return item ? item_pares : initialValue;
      } catch (error) {
        // If error also return initialValue
        // console.log(error);
        return initialValue;
      }
    });
      return storedValue;
  }
  
  export default Cart
  
  
  