TODOs:

1. HOME
   Add overview of the service and its features and add a component of listed properties
2. APARTMENTS

    1. Add a filter for a country, city, price.
    2. Comp. PropertyCard should have a name, picture, area, number of rooms, monthtly price.
    3. Comp. PropertyDetails should have an array of images, name, rental price, depositamount, number of rooms, area, description, propertyNftId, floor, build year, heating type, parking space, equipment and hash of Terms and Conditions, reviews section.
       Should it have contacts (phone no., email) and start chat button?
       If I have time:
       I can add Amenities with icons (Wifi, pets alllowed, washer, workspace, etc.)
       I can add a map, that would show a propertys place in a map.
    4. "Apply for Rent" form should call contracts "createRentContract" function.
       The form should automatically take propertyNftId and tsbtID, a user should input rentalTerm, rentalPrice, depositAmount and startDate.
       Submitting the form should call the function.
       Should we leave for user to decide a term for application availability or make it eg. 3 days?

3. MY PROPERTIES

    1. ✅ We should get UserProperties and filter only listed properties. Should we add another solidity function to get userListedProperties or should we somehow filter them in the frontend?
    2. Comp. MyPropertyCard should have a name, picture, area, monthtly price, available from, status. Maybe day listed?
    3. Comp. MyPropertyDetails should have an array of images, rental price, depositamount, number of rooms, area, description, propertyNftId, floor, build year, heating type, parking space, equipment and hash of Terms and Conditions, reviews section.
       Should we just use PropertyDetails component? We could add additional information after the component.
       Should we add "Update Property" button and let owner update a property here?
       Should we eliminate "List property for rent" and just make a "Mint New PropertyNFT" button and other button for "Not Listed Properties".
        1. "Screen Rent Applications" should open a new page "[address]/properties/[id]/rentApplications"
           In the page we should call contracts "getRentContracts" function. Should the page display all the applications or only the valid ones? How about application validity time?
           We could let a user to select a validUntil date and make the frontend show status "invalid" if that date is passed.
           After selecting a specific application a "Sign Rent Contract" button should call contracts "acceptRentContract" function.
           Should we make a separate page for each rentApplication?
        2. "Rent History" should open a new page "[address]/properties/[id]/rentHistory".
        3. "Create Property" button should open a form, that would take owner name, address and country code. After pressing "Submit":
            1. Uploading to NFT.storage function (it is now in the backend ) ,,uploadPropertyNftToStorage" should be called. This function returns tokenURI.
            2. Contracts "mintPropertyNFT" should be called. This function returns nftTokenId.
        4. "Not Listed Properties" should display properties, that are not listed (using PropertyCard), also list of nft, that do not have a associated Property created.
            1. After selecting a property, there should be two buttons "Update Property" and "List Property For Rent".
               "Update Property" should open a form (like a listPropery form) and also call contracts "updateProperty" function.
               "List Property for Rent" should call contracts "relistProperty" function.
            2. Component "PropertyNft" should have a nftTokenId, owner name, address, country code.
               After clicking on PropertyNft card a listProperty form should apear with these fields:
               name, description, rentalTerm, rentalPrice, depositAmount, hash (a contracts listProperty function should be called with these),
               also fields for: number of rooms, area, floor, build year, heating type, parking space, equipment.
               How can we let user to upload the images of property?
               How should we implement this form?

4. MY RENTALS "/[address]/myRentals.js"
   If a wallet address doesnt have a sbt, when a page shows a form for creating soulbound token, that has a "name" field, after submiting a form:

    1. Uploading to NFT.storage function (it is now in the backend ) "uploadSbtToStorage" should be called. This function returns tokenURI.
    2. Contracts "mintSoulboundToken" with name and tokenURI should be called. This function returns sbtTokenId.
       If a wallet address has sbtTokenId, when the page shows:
       "My Rental Applications" button. By pressing this button a page should show "/[address]/myRentalApplications.js"
       Contracts "getTenantRentContracts" function should be called, that returns a list of RentContracts.
       If a tenant has a signed Rent Contract, the page should show a current Rent Contract.

5. ACCOUNT
6. MESSAGES

TODO :
When a tenant creates another rentapplication for the same property, cancel or edit the old application
