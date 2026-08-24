 
import { createContext, useReducer } from 'react';
import axiosInstance from './lib/axios.js';

export const Store = createContext(); 
const syncCartWithDB = async (userInfo, cartItems) => {
  if (userInfo && userInfo._id) {
    try {
      await axiosInstance.put('/api/users/update-cart', {
        userId: userInfo._id,
        cartItems: cartItems
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` } 
      });
      console.log("Cart synced with MongoDB successfully!");
    } catch (err) {
      console.error("Error syncing cart with DB:", err);
    }
  }
};

const userInfoFromStorage = localStorage.getItem('userInfo') 
  ? JSON.parse(localStorage.getItem('userInfo')) 
  : null;

const initialState = {
  userInfo: userInfoFromStorage, 
  cart: { 
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod') 
      : '',
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    cartItems: userInfoFromStorage
      ? (localStorage.getItem(`cartItems_${userInfoFromStorage._id}`)
          ? JSON.parse(localStorage.getItem(`cartItems_${userInfoFromStorage._id}`))
          : [])
      : (localStorage.getItem('cartItems_guest') 
          ? JSON.parse(localStorage.getItem('cartItems_guest'))
          : []),
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const { userInfo } = state; 
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
        
      const cartKey = userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest';
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      
      syncCartWithDB(userInfo, cartItems);
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    
    case 'CART_REMOVE_ITEM': { 
      const { userInfo } = state;
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      
      const cartKey = userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest'; 
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      
      syncCartWithDB(userInfo, cartItems);
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    

    case 'CART_CLEAR': {
  const { userInfo } = state;
  const cartKey = userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest';
  localStorage.removeItem(cartKey); 
  return { ...state, cart: { ...state.cart, cartItems: [] } };
     }

    case 'SIGNIN': {
      const user = action.payload;
      const cartKey = `cartItems_${user._id}`;
       
      localStorage.setItem('userInfo', JSON.stringify(user)); 
      localStorage.setItem(cartKey, JSON.stringify(user.cartItems || []));
      
      return { 
        ...state, 
        userInfo: user, 
        cart: { ...state.cart, cartItems: user.cartItems || [] }
      };
    }
    
    case 'SIGNOUT': { 
      localStorage.removeItem('userInfo'); 
      
      const guestCart = localStorage.getItem('cartItems_guest')
        ? JSON.parse(localStorage.getItem('cartItems_guest'))
        : [];
        
      return { 
        ...state, 
        userInfo: null, 
        cart: { ...state.cart, cartItems: guestCart,
                            shippingAddress:{},
                             paymentMethod:''} 
      };
    }
    
    case 'SAVE_SHIPPING_ADDRESS': {
       return {
         ...state,
         cart:{
           ...state.cart,
           shippingAddress: action.payload
         }
       }
    };

     case 'SAVE_PAYMENT_METHOD': {
  localStorage.setItem('paymentMethod', action.payload); 
  return {
    ...state,
    cart: {
      ...state.cart,
      paymentMethod: action.payload
    }
  }
};


    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}