// //using react context here

// // We use React Context primarily to solve the problem of Prop Drilling. In a typical React application, data is passed top-down (parent to child) via props. However, when a piece of data is needed by a component deep in the tree, you end up passing that data through many intermediate components that don't actually need it. 
// //This can make the code harder to maintain and understand. React Context allows you to create a global state that can be accessed by any component in the tree, without having to pass props down manually at every level. This makes it easier to manage and share state across your application, especially for things like user authentication, theme settings, or any data that needs to be accessed by multiple components at different levels of the component hierarchy.
// import { createContext, useReducer } from "react";
// export const Store = createContext(); //create a context object using createContext function from react and export it so that we can use it in other components to access the global state and dispatch function provided by the StoreProvider component. We will use this Store to manage the global state of our application and provide it to all the components that need it.
// const initialState = {
//     cart :{ 
//         cartItems : [], //cart is object and cartitem is array because we can have multiple items in the cart and each item will be an object that contains the details of the product added to the cart like name, price, quantity etc. and we will manage the state of the cart using reducer function and dispatch actions to update the state of the cart based on the actions dispatched.
//    } ,
// };
// function reducer(state, action){
//     switch(action.type){
//         case 'CART_ADD_ITEM': //when we add an item to the cart then we will dispatch this action and in the reducer function we will check if the item already exists in the cart or not and if it exists then we will update the quantity of that item in the cart and if it does not exist then we will add that item to the cart and update the state of the cart accordingly.
//             const newItem = action.payload; //we are getting the new item that we want to add to the cart from the action payload and we will use this new item to check if it already exists in the cart or not and then update the state of the cart accordingly.
//             const existItem = state.cart.cartItems.find((item) => item._id === newItem._id); //we are checking if the new item that we want to add to the cart already exists in the cart or not by comparing the _id of the new item with the _id of the items already present in the cart and if it exists then we will update the quantity of that item in the cart and if it does not exist then we will add that item to the cart and update the state of the cart accordingly.
//             const cartItems = existItem ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) : [...state.cart.cartItems, newItem]; //if the new item already exists in the cart then we will update the quantity of that item in the cart by mapping through the cart items and checking if the _id of the item matches with the _id of the existing item then we will replace that item with the new item that we want to add to the cart and if it does not match then we will keep that item as it is and if the new item does not exist in the cart then we will add that item to the cart by spreading the existing cart items and adding the new item to the end of the array of cart items and then we will update the state of the cart accordingly by returning a new state object with the updated cart items.
//             return {...state, cart: {...state.cart, cartItems}}; //we are returning a new state object with the updated cart items by spreading the existing state and then updating the cart property of the state with a new object that contains the existing properties of the cart and then updating the cartItems property of the cart with the updated array of cart items.
       
//        //if uses below line then one item may add multiple times in the cart because we are not checking if the item already exists in the cart or not and we are directly adding the new item to the cart without checking if it already exists in the cart or not and if it already exists in the cart then we will have multiple entries of the same item in the cart which is not good for user experience and also it will create confusion for the user when they see multiple entries of the same item in the cart and they will not know how many quantity of that item they have added to the cart and it will also create problems when they want to update the quantity of that item in the cart because they will have to update the quantity of all the entries of that item in the cart which is not efficient and also it will create problems when they want to remove that item from the cart because they will have to remove all the entries of that item from the cart which is not efficient.
//        // return {...state, cart: {...state.cart, cartItems:[...state.cart.cartItems, action.payload]}}; //we are returning a new state object with the updated cart items by spreading the existing state and then updating the cart property of the state with a new object that contains the existing properties of the cart and then updating the cartItems property of the cart with the updated array of cart items that we get from the action payload when we dispatch the CART_ADD_ITEM action.
//       //...state keep all values of state as it is and then we are updating the cart property of the state with a new object that(...state.cart) contains the existing properties of the cart and then updating the cartItems property of the cart with the updated array of cart items that we get from the action payload when we dispatch the CART_ADD_ITEM action.
//         default:
//             return state;
// }
// }
// export function StoreProvider(props){
//     const [state, dispatch] = useReducer(reducer, initialState); //useReducer is a hook that is used to manage the state of our application in a more efficient way than useState. It takes a reducer function and an initial state as arguments and returns the current state and a dispatch function that we can use to update the state based on the actions we dispatch.
// const value = {state, dispatch}; //we are creating a value object that contains the current state and the dispatch function that we can use to update the state based on the actions we dispatch. We will pass this value object to the Store.Provider component so that all the components that are wrapped inside the StoreProvider can access the global state and dispatch function provided by the StoreProvider component.
//     return <Store.Provider value={value}>{props.children}</Store.Provider> //we are using the Store.Provider component to provide the global state and dispatch function to all the components that are wrapped inside the StoreProvider component. We are passing the value object that contains the current state and the dispatch function as a prop to the Store.Provider component so that all the components that are wrapped inside the StoreProvider can access the global state and dispatch function provided by the StoreProvider component.
// }




import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {  //refresh karne ke baad cart 
    cartItems: localStorage.getItem('cartItems') //refresh ke baad cart me jo h vo hate na isliye
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [], 
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      // Agar item pehle se cart mein hai, toh replace/update karo, nahi toh append karo
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
        localStorage.setItem('cartItems',JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': { 
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id //yaha input me jo id mili h us product ko chhodkar baki products filter karke array me dalkar return kr rhe h
      );
       localStorage.setItem('cartItems',JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}