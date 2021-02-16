import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-unfetch'
import withApollo from 'next-with-apollo'
import cookie from 'cookie'

const uri = 'http://localhost:4444/graphql';
const httpLink = createHttpLink({ uri, fetch })

const authLink = setContext ((_, {headers}) => {
    // Get Token from cookie
    let cookies

    // Server side
    if(headers){
        cookies = cookie.parse(header.cookie || '')
    }

    // Client side
    if (typeof window != 'undefined') {
        cookies = cookie.parse(document.cookie || '')
    }

    // var cookies_member = cookie.parse('memberID');
    // if (cookies_member) {
    //   const randomNumber = Math.floor(Math.random() * 10000);
    //   console.log(randomNumber);
    //   cookie.serialize('memberID', randomNumber);
    //   var cookies_member = cookie.parse('memberID');
    // }
    // console.log(cookies_member);



    const token = cookies && cookies.jwt || ''
    // const mid = cookies && cookies.memberID || Math.floor(Math.random() * 10000)
    // console.log(`memberID ${mid}`);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }

}) 

export default withApollo(({ initialState }) => {
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache().restore(initialState || {})
    });
});