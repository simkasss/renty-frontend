export function PropertyListingCard(( property: { name, rentalPrice, rentalTerm }  )) {
   return ( <div
    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    role="button"
    tabIndex={0}
    onClick={onClick}
>
    <div>
        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</div>
        <span className="font-normal text-gray-700 dark:text-gray-400">Rental Price:</span>{" "}
        <span className="text-gray-200 text-xs font-extrabold tracking-tight">{rentalPrice} ETH</span>
        <div className="font-normal text-gray-700 dark:text-gray-400">Rental Term: {rentalTerm / 60 / 60 / 24} days</div>
    </div>
</div>)
}