import '../styles/globals.css'
import PageLayout from '../components/PageLayout'
import { ApolloProvider } from '@apollo/react-hooks'
import apolloClient from '../apollo/apolloClient'

function MyApp({ Component, pageProps, apollo }) {


  return (
    <ApolloProvider client={apollo}>

      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>

    </ApolloProvider>
  )
}

// MyApp.getInitialProps = async (appContext) => {
//   const appProps = await App.getInitialProps(appContext)
//   return { ...appProps }
// }

export default apolloClient(MyApp)
