import "@/styles/globals.css"
import { MoralisProvider } from "react-moralis" // in order to use web3uicomponent
import Header from "@/components/Header"
import Head from "next/head"

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>RentDapp</title>
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Header />

                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}
