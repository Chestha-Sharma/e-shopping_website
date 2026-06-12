import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { Store, StoreProvider } from './store';
{/*HelmetProvider uses for managing the document head in a React application. it allows you to manage the meta tags, title, and other elements in the document head. */}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <StoreProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
     {/* React.StrictMode is a wrapper component that helps to identify potential problems in an application and provides warnings in the console during development. It does not affect the production build of the application. */}
     {/* App component is the main component of the application that contains all the other components and routes of the application. It is rendered inside the StrictMode wrapper to enable strict mode checks for all the components in the application. */}
     {/* StrictMode helps to identify potential problems in an application and provides warnings in the console during development. It does not affect the production build of the application. */}
     {/* App component is the main component of the application that contains all the other components and routes of the application. It is rendered inside the StrictMode wrapper to enable strict mode checks for all the components in the application. */}
     {/* StrictMode helps to identify potential problems in an application and provides warnings in the console during development. It does not affect the production build of the application. */}
     {/* App component is the main component of the application that contains all the other components and routes of the application. It is rendered inside the StrictMode wrapper to enable strict mode checks for all the components in the application. */}
     {/* StrictMode helps to identify potential problems in an application and provides warnings in the console during development. It does not affect the production build of the application. */}
     {/* App component is the main component of the application that contains all the other components and routes of the application. It is rendered inside the StrictMode wrapper to enable strict mode checks for all the components in the application. */}
   </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
