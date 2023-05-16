import { useSelector } from "react-redux"
import { Header } from "../../components/Header"

export function HeaderContainer() {
    const { wallet } = useSelector((states) => states.globalStates)

    return <Header wallet={wallet} />
}
