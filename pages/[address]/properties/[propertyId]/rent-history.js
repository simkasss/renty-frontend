import { useRouter } from "next/router"
import React from "react"
import { useSelector } from "react-redux"

export default function RentContract() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [properties, setProperties] = React.useState([])
    const { wallet } = useSelector((states) => states.globalStates)

    return <>Displays Rent History</>
}
