import "../styles/globals.css"
import { MoralisProvider } from "react-moralis" // in order to use web3uicomponent
import Head from "next/head"
import { HeaderContainer } from "../src/containers/HeaderContainer"
import { Provider } from "react-redux"
import { store } from "../store"
import { monitorWalletConnection } from "../constants/blockchain"
import { useEffect, useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"

export default function App({ Component, pageProps }) {
    // useEffect(() => {
    //     monitorWalletConnection()
    // }, [])

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Renty</title>
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Provider store={store}>
                    <HeaderContainer />

                    <Component {...pageProps} />
                </Provider>
            </MoralisProvider>
        </ThemeProvider>
    )
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#713EA6",
        },
        secondary: {
            main: "#311b47",
        },
    },
    typography: {
        fontFamily: "Arial, sans-serif",
    },
})
