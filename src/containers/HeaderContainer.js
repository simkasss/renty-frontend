import { useSelector } from "react-redux"
import { Header } from "../../components/Header"

const connectWallet = async () => {
    try {
        if (!ethereum) return reportError("Please install Metamask")
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        store.dispatch(setWallet(accounts[0]))
    } catch (error) {
        reportError(error)
    }
}

export function HeaderContainer() {
    const { wallet } = useSelector((states) => states.globalStates)

    return <Header wallet={wallet} connectWallet={connectWallet} />
}
