import "../styles/globals.css"
import { MoralisProvider } from "react-moralis" // in order to use web3uicomponent
import Head from "next/head"
import Footer from "../components/Footer"
import { HeaderContainer } from "../src/containers/HeaderContainer"
import { Provider } from "react-redux"
import { store } from "../store"
import { monitorWalletConnection } from "../constants/blockchain"
import { useEffect, useState } from "react"

export default function App({ Component, pageProps }) {
    const [showChild, setShowChild] = useState(false)
    useEffect(() => {
        setShowChild(true)
        monitorWalletConnection()
    }, [])

    return (
        <div>
            <Head>
                <title>RentDapp</title>
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Provider store={store}>
                    <HeaderContainer />
                    <Footer />
                    <Component {...pageProps} />
                </Provider>
            </MoralisProvider>
        </div>
    )
}
