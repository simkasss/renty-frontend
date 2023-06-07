export const globalActions = {
    setWallet: (state, action) => {
        state.wallet = action.payload
    },
    setListedProperties: (state, action) => {
        state.listedProperties = action.payload
    },
    setUserProperties: (state, action) => {
        state.userProperties = action.payload
    },
    setConversionChecked: (state, action) => {
        state.conversionChecked = !state.conversionChecked
    },
}
