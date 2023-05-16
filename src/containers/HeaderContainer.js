import { useSelector } from "react-redux"
import { ConnectedHeader } from "../../components/ConnectedHeader"
import { GuestHeader } from "../../components/GuestHeader"
import { store } from "../../store"
import { globalActions } from "../../store/globalSlices"

const connectWallet = async () => {
    const { setWallet } = globalActions

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

    return wallet ? <ConnectedHeader wallet={wallet} /> : <GuestHeader connectWallet={connectWallet} />
}
