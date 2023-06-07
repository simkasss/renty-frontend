import React from "react"
import { Container, Typography, Grid, Card, CardContent } from "@mui/material"
import SecurityIcon from "@mui/icons-material/Security"
import PublicIcon from "@mui/icons-material/Public"
import BoltIcon from "@mui/icons-material/Bolt"
import GroupsIcon from "@mui/icons-material/Groups"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircle from "@mui/icons-material/AccountCircle"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AnnouncementIcon from "@mui/icons-material/Announcement"
import NotInterestedIcon from "@mui/icons-material/NotInterested"
import SendIcon from "@mui/icons-material/Send"
import KeyIcon from "@mui/icons-material/Key"

export function Home() {
    const [sectionVisibility, setSectionVisibility] = React.useState({
        landlord: false,
        tenant: false,
    })

    const toggleSectionVisibility = (sectionName) => {
        setSectionVisibility((prevState) => ({
            ...prevState,
            [sectionName]: !prevState[sectionName],
        }))
    }

    return (
        <Container align="center" sx={{ width: 1000 }}>
            <Typography variant="h4" align="center" sx={{ pt: 4, pb: 2, fontSize: 30 }} color="primary">
                <HolidayVillageIcon fontSize="large" sx={{ mb: 1, mr: 1 }} />
                Renty
            </Typography>

            <Typography variant="body1" align="left" gutterBottom sx={{ pb: 2 }}>
                Renty is a decentralized real estate rental platform, built on blockchain technology that enables property owners to rent out their
                properties to tenants in a secure and transparent way. Platform offers full rental management for tenants and landlords - from
                searching for a property to signing and managing rent contracts.
            </Typography>
            <Typography variant="h6" align="left" gutterBottom sx={{ pb: 2 }} color="primary">
                Why to use it?
            </Typography>
            <Typography variant="body1" align="left" gutterBottom sx={{ pb: 2 }}>
                The traditional real estate rental market faces a lack of transparency and security, rental processes are lengthy and complex, global
                accessibility is usually limited, disputes and fraudulent activities are persistent issues. Decentralized real estate rental platform
                Renty eliminates or reduces these issues, making renting more secure <SecurityIcon color="primary" />, accessible{" "}
                <PublicIcon color="primary" />, and efficient
                <BoltIcon color="primary" />, for both tenants and landlords.
            </Typography>
            <Typography variant="h6" align="left" gutterBottom sx={{ pb: 2 }} color="primary">
                How to use it?
            </Typography>
            <Typography variant="body2" align="left" gutterBottom sx={{ mb: 2 }}>
                Metamask connection <KeyIcon color="primary" /> is required in order to access all the functionalitty of the platform. Users can only
                access the HOME page and browse properties in the PROPERTIES page if not connected with Metamask. <br />
                Landlords are able to create and list properties, screen rent applications, sign rent contracts, track tenant payments{" "}
                <AttachMoneyIcon color="primary" />, manage disputes
                <AnnouncementIcon color="primary" />, terminate contracts <NotInterestedIcon color="primary" /> and withdraw earnings{" "}
                <AttachMoneyIcon color="primary" />. <br />
                Tenants are able to apply for rent and after landlor confirms an application, rent contract is automaytically signed. Tenant can
                review contract details, execute all the payments
                <AttachMoneyIcon color="primary" />, manage disputes <AnnouncementIcon color="primary" />, terminate contract{" "}
                <NotInterestedIcon color="primary" /> and withdraw deposit <AttachMoneyIcon color="primary" /> after it is released via platform.
                <br />
                <br />
                For more detailed instructions select "For Landlords" or "For Tenants" below.
                <br />
            </Typography>
            <Typography variant="body1" align="left" gutterBottom sx={{ mt: 2 }} color="primary">
                For Landlords <KeyboardArrowDownIcon color="primary" fontSize="large" onClick={() => toggleSectionVisibility("landlord")} />
            </Typography>
            <Typography variant="body2" align="left" gutterBottom style={{ display: sectionVisibility.landlord ? "" : "none" }}>
                1. Sign In using Metamask <KeyIcon color="primary" />. <br />
                2. Click on the Menu <MenuIcon color="primary" />, select Account <AccountCircle color="primary" /> and add your contact details
                (email address or/and phone number). 3. Click on the Menu <MenuIcon color="primary" /> and select My Properties{" "}
                <HomeIcon color="primary" />. <br />
                This page is for creating and managing your properties, their rent applications and contracts. <br />
                4. In order to create a property, click CREATE NEW PROPERTY. Fill in all the fields and submit a form. By submiting a form a property
                is created and NFT for your property is automatically minted. <br />
                5. After creating a property, it appears in Not Listed Properties section of My Properties <HomeIcon color="primary" /> page. Click
                MORE DETAILS on property's card to get more information and access property actions. In this page you can review and update property
                details, list a property or review rent history. <br />
                6. In order to list a property, click LIST PROPERTY. You have to fill in the rental price, deposit amount, the description, select
                rental term, upload photos of your property and upload the Terms and Conditions document. <br />
                After submiting, a property appears in main PROPERTIES page and in Listed Properties section of My Properties{" "}
                <HomeIcon color="primary" /> page. <br />
                7. When property is listed, tenants can apply for rent, and by clicking MORE DETAILS on your property's card you can screen rent
                applications or remove property from list. <br />
                You can select a rent application that is suitable for you and sign a rent contract. Tenant contact details{" "}
                <SendIcon color="primary" /> are provided if there is a need to negotiate or adjust application before signing it.
                <br />
                8. When you sign a rent contract, you can access it in your property's page by clicking CURRENT RENT CONTRACT. <br />
                In this page you can review all the contract details, disputes <AnnouncementIcon color="primary" />, access tenant contact details{" "}
                <SendIcon color="primary" />, or terminate rent contract <NotInterestedIcon color="primary" />. Tenant executes all the payments via
                platform, so you can also review payment history <AttachMoneyIcon color="primary" />, After expiration date, the contract is
                completed.
                <br />
                9. Both tenant and landlord can create a dispute <AnnouncementIcon color="primary" /> . A dispute is solved only when both tenant and
                landlord selects solve dispute. Also, by terminating a rent contract, a dispute is automatically created. <br />
                10. After expiration of the contract, a tenant can only withdraw the deposit <AttachMoneyIcon color="primary" /> after landlord gives
                permission to release the deposit.
                <br />
                11. To withdraw your earnings, click on the Menu <MenuIcon color="primary" /> and select Account <AccountCircle color="primary" />
                . Now you can review your total proceeds and withdraw a specified amount. <br />
            </Typography>
            <Typography variant="body1" align="left" gutterBottom color="primary">
                For Tenants
                <KeyboardArrowDownIcon fontSize="large" onClick={() => toggleSectionVisibility("tenant")} />
            </Typography>
            <Typography variant="body2" align="left" gutterBottom sx={{ pb: 2 }} style={{ display: sectionVisibility.tenant ? "" : "none" }}>
                1. Sign In using Metamask <KeyIcon color="primary" />
                . <br />
                2. Click on the Menu <MenuIcon color="primary" />, select Account <AccountCircle color="primary" /> and add your contact details
                (email address or/and phone number).
                <br />
                3. Select PROPERTIES page, where you can browse properties and click on the property you are interested in. <br />
                In this page you can review all the photos, property details, rental terms, access landlord contact details{" "}
                <SendIcon color="primary" /> or review rental terms and conditions document. If you want to apply, click APPLY FOR RENT. Select a
                start date, specify number of days this application is valid, fill other fields of the form and click SUBMIT. <br />
                4. After applying for rent, a rent application appears in My Rentals <HomeIcon color="primary" /> page. You can check the status of
                the rent application. The rent application can only be canceled if a landlord have not confirmed the application yet. When landlord
                confirm rent application, a rent contract is automatically signed. <br />
                5. If you have a rent contract, you can access it in MY RENTALS page by clicking MY RENT CONTRACT. In this page you can review all the
                contract details, landlord contact details <SendIcon color="primary" />, payment history <AttachMoneyIcon color="primary" />, disputes{" "}
                <AnnouncementIcon color="primary" />, transfer deposit <AttachMoneyIcon color="primary" /> or terminate rent contract{" "}
                <NotInterestedIcon color="primary" />. After you transfer the deposit, you are able to pay rent too{" "}
                <AttachMoneyIcon color="primary" />. After expiration date, the contract is completed. <br />
                6. Both tenant and landlord can create a dispute <AnnouncementIcon color="primary" />. A dispute is solved only when both tenant and
                landlord selects solve dispute. Also, by terminating a rent contract, a dispute is automatically created. <br />
                7. After expiration of the contract, a tenant can only withdraw the deposit <AttachMoneyIcon color="primary" /> after landlord gives
                permission to release the deposit.
            </Typography>
            <Typography variant="h6" align="left" gutterBottom sx={{ pb: 2 }} color="primary">
                What are the benefits?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 250 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <SecurityIcon fontSize="large" sx={{ mr: 2, mb: 1 }} />
                                Transparent and secure
                            </Typography>
                            <Typography variant="body2" align="left">
                                With a decentralized platform, the rental process becomes more transparent as all transactions, agreements, photos and
                                property information are recorded on a public ledger. Blockchain technology ensures the security and immutability of
                                data on decentralized platforms. This transparency and greater security helps build trust between renters and property
                                owners, reducing the potential for disputes or fraud.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 250 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <PublicIcon fontSize="large" sx={{ mr: 2, mb: 1 }} /> Increased accessibility
                            </Typography>
                            <Typography variant="body2" align="left">
                                Decentralized platform provides more exposure for listings due to accessibility of rental properties from all around
                                the world. Individuals seeking rental properties in foreign countries face numerous challenges, including
                                unfamiliarity with local rental practices and different local currency. Platform provides cross-border rental
                                transactions, transparent processes and verified property listings on the blockchain. This streamlines the rental
                                experience for international renters.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 250 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <BoltIcon fontSize="large" sx={{ mr: 2, mb: 1 }} /> Fast and efficient
                            </Typography>
                            <Typography variant="body2" align="left">
                                By utilizing a real estate platform, tenants have the convenience of exploring property listings without the need to
                                physically leave their comfort zones. Platform provides real-time information about the availability status of rental
                                properties. Smart contracts automate various aspects of the rental process, such as managing security deposits, and
                                facilitating rent payments. This automation reduces paperwork and minimizes the need for manual intervention.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 250 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <GroupsIcon fontSize="large" sx={{ mr: 2, mb: 1 }} /> Elimination of intermediaries
                            </Typography>
                            <Typography variant="body2" align="left">
                                By removing intermediaries such as real estate agents or property managers, decentralized platforms enable direct
                                communication and interaction between renters and property owners. This direct interaction allows for faster response
                                times, immediate clarification of queries, and prompt decision-making. It cuts down on costs and allows for more
                                efficient rental processes.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography variant="h6" align="left" gutterBottom sx={{ pb: 2, pt: 2 }} color="primary">
                Utilizing Web3 tools
            </Typography>
            <Typography variant="body2" align="left" sx={{ mb: 4 }}>
                Immutable records of rental applications, rent contracts and transactions are securely stored on the blockchain. Main rental processes
                are executed using a platform: applying for rent, screening tenants, signing and terminating rent contracts, transferring and
                releasing rental deposit, paying rent, creating and solving disputes. Property NFTs are stored on NFT.Storage. Soulbound Tokens,
                property metadata, photos, and terms and conditions document are stored on Pinata. Chainlink Data Feeds ar used for converting
                ETH/USD.
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 280 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <AccountCircle fontSize="large" sx={{ mr: 2, mb: 1 }} />
                                Tenant Soulbound Tokens
                            </Typography>
                            <Typography variant="body2" align="left">
                                To apply for a rental using the platform, tenants are required to mint a soulbound token, which cannot be transferred.
                                Utilizing a soulbound token enhances the security of the rental agreement by providing a unique and non-fungible token
                                that is tied exclusively to the tenant. Landlords have the ability to review the tenant's rental history, enabling
                                them to assess the creditworthiness of potential tenants and make well-informed decisions regarding rental
                                arrangements. Tenants, on the other hand, can utilize their rental history as evidence of their reliability as
                                renters, potentially allowing them to negotiate more favorable rental terms in the future.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ height: 280 }}>
                            <Typography variant="body1" gutterBottom color="primary">
                                <HomeIcon fontSize="large" sx={{ mr: 2, mb: 1 }} /> Property NFTs
                            </Typography>
                            <Typography variant="body2" align="left">
                                When creating a property, a landlord mints an NFT which contains the owner's name, property address, and country code.
                                By minting an NFT for a property, an immutable record of ownership is created, and crucial information about the
                                property is securely stored on a blockchain. This approach offers enhanced security and transparency. Furthermore, the
                                blockchain also serves as a repository for the property's rent history, rent contract payments and disputes.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}
