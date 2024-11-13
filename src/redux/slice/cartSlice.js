import { createSlice } from "@reduxjs/toolkit";


const ProductSlice = createSlice({
    
        name: 'products',
        initialState: {
          CartArr: [],
        },
        reducers: {
          addProduct: (state, action) => {
            const productIndex = state.CartArr.findIndex((p)=> p.id === action.payload.id )

            if (productIndex === -1) {
                state.CartArr.push({...action.payload, quantity: 1})
            } else {
                state.CartArr[productIndex].quantity += 1;
            }
          },
          removeProduct: (state, action) => {
            const productIndexRemove = action.payload.id
            const newCartArr = state.CartArr.filter((item) => item.id !== productIndexRemove)
            return {...state, CartArr: newCartArr}
        },
        },
      
})

// Action creators are generated for each case reducer function
export const { addProduct, removeProduct } = ProductSlice.actions

export default ProductSlice.reducer