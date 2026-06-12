export const geterror = (error) =>{
    return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
 }
//message coming from server.js through geterror function in util.js and we are passing the error we got from backend to geterror function and it will return the message we got from backend if there is a message in the response and if there is no message in the response then it will return the generic error message we got from browser.

// Yahan humne Named Export (export const) ka use kiya hai, export default ka nahi. Iske piche do main reasons ho sakte hain:
// Multiple Exports: Agar aap ek hi file (jaise utils.js) mein bahut saare helper functions rakhna chahte hain (e.g., getError, formatDate, calculatePrice), toh aap sirf ek hi default export kar sakte hain. Baaki sab ke liye aapko export const use karna padega.

// Aapka function aise kaam kar raha hai:
// Scenario A (Backend Error): Agar backend se error aaya (jaise 404 ya 400), toh Axios error.response populate karega. Aapka logic error.response.data.message return karega (jo backend ne bheja hoga, e.g., "Invalid Password").
// Scenario B (Network/Frontend Error): Agar server down hai ya internet nahi chal raha, toh error.response nahi hoga. Aise mein logic error.message return karega (jo generic browser error hota hai, e.g., "Network Error").