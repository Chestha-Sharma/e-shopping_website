import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Chart from 'react-google-charts';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import { Store } from '../store';
const reducer=(state,action)=>{
   switch(action.type){
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
   }
}


export default function Dashboardscreen() {
    const [{loading, summary , error}, dispatch] = useReducer(reducer,{
        loading : true, 
        error : ''
    });
    const { state } = useContext(Store);
        const { userInfo } = state;

    useEffect(()=>{
         const fetchData = async ()=>{
            try{
           const {data} = await axios.get('/api/order/summary',{
            headers : {
                authorization : `Bearer ${userInfo.token}`
            }
           }
        );
        dispatch({type : 'FETCH_SUCCESS' , payload : data});
        } catch(error){
            dispatch({type : 'FETCH_FAIL' , payload : error.message});
        }  
     };
        fetchData();
    },[userInfo]);
  return (
    // <div>
    //   <h1>Welcome {userInfo.name}</h1>
    //   {loading ?
    //   <Loading />
    // : error ?
    //   <Msg variant="danger">{error}</Msg>
    // :
    //   <> 
    //    <Row>
    //     <Col md={4}>
    //     <Card>
    //         <Card.Body>
    //             <Card.Title>
    //                 {summary.users && summary.users[0] ?
    //                 summary.users[0].numUsers
    //                 : 0
    //                 } Users
    //             </Card.Title>
    //         </Card.Body>
    //     </Card>
    //     </Col>
    //     <Col md={4}>
    //     <Card>
    //         <Card.Body>
    //             <Card.Title>
    //                 {
    //                     summary.orders && summary.users[0] ?
    //                     summary.orders[0].numOrders
    //                     : 0 
    //                 } Orders
    //             </Card.Title>
    //         </Card.Body>
    //     </Card>
    //         </Col>
    //         <Col md={4}>
    //           <Card>
    //             <Card.Body>
    //               <Card.Title> 
    //                 {summary.orders && summary.users[0]
    //                   ? summary.orders[0].totalSales.toFixed(2)
    //                   : 0} rupees
    //               </Card.Title> 
    //             </Card.Body>
    //           </Card>
    //         </Col>
    //    </Row>
    //      <div className='my-3'>
    //         <h2>Sales</h2>
    //         {
    //             summary.dailyOrders.length ==0 ? 
    //             <Msg variant="danger">No Sales</Msg>
    //             :(
    //                 <Chart
    //                 width="100%"
    //                 height="400px"
    //                 chartType="AreaChart"
    //                 loader={<div>Loading Chart....</div>}
    //                 data={[
    //                     ['Date', 'Sales'],
    //                     ...summary.dailyOrders.map((x) => [x.createdAt, x.sales])
    //                 ]}></Chart>
    //             )
    //         }
    //      </div>
    //      <div className='my-3'>
    //         <h2>Categories</h2>
    //         {
    //             summary.productCategories.length ==0 ? 
    //             <Msg variant="danger">No Categories</Msg>
    //             :(
    //                 <Chart
    //                 width="100%"
    //                 height="400px"
    //                 chartType="PieChart"
    //                 loader={<div>Loading Chart....</div>}
    //                 data={[
    //                     ['Category', 'Products'],
    //                     ...summary.productCategories.map((x) => [x._id, x.count])
    //                 ]}></Chart>
    //             )
    //         }
    //      </div>
    //     </>
    //     }
    // </div>



    <div>
      <h1>Welcome {userInfo.name}</h1>
      {loading ? <Loading /> : error ? <Msg variant="danger">{error}</Msg> :
      <> 
       <Row>
        {/* Users Card */}
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d6efd' }}>
                {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
              </Card.Title>
              <Card.Text style={{ fontSize: '1.1rem', color: '#6c757d' }}>
                👥 Total Users
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Orders Card */}
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold', color: '#198754' }}>
                {summary.orders && summary.orders[0] ? summary.orders[0].numOrders : 0}
              </Card.Title>
              <Card.Text style={{ fontSize: '1.1rem', color: '#6c757d' }}>
                📦 Paid Orders
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Revenue Card */}
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                ₹ {summary.orders && summary.orders[0] ? summary.orders[0].totalSales.toFixed(2) : 0}
              </Card.Title>
              <Card.Text style={{ fontSize: '1.1rem', color: '#6c757d' }}>
                💰 Total Revenue
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
       </Row>

       {/* Sales Chart */}
       <div className='my-3'>
          <h2>📈 Sales Over Time</h2>
          {summary.dailyOrders.length === 0 ?
            <Msg variant="danger">No Sales Data</Msg>
            : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales (₹)'],
                  ...summary.dailyOrders.map((x) => [
                    new Date(x._id).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',  // Jan, Feb, Mar
                      year: 'numeric'
                    }),
                    x.sales
                  ])
                ]}
                options={{
                  colors: ['#0d6efd'],
                  hAxis: { title: 'Date' },
                  vAxis: { title: 'Revenue (₹)' },
                  legend: { position: 'top' },
                }}
              />
            )
          }
       </div>

       {/* Categories Chart */}
       <div className='my-3'>
          <h2>🛍️ Availiable Products by Category</h2>
          {summary.productCategories.length === 0 ?
            <Msg variant="danger">No Categories</Msg>
            : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count])
                ]}
                options={{
                  colors: ['#0d6efd', '#198754', '#dc3545', '#ffc107'],
                  legend: { position: 'right' },
                  pieSliceText: 'value',
                  title: 'Product Distribution',
                }}
              />
            )
          }
       </div>
      </>
      }
    </div>
  )
}



// useState vs useReducer
// useState — "Ek Simple Dabba"
// Ek cheez rakho, seedha badlo। Bas।
// jsxconst [count, setCount] = useState(0);

// setCount(5);        // seedha value do
// setCount(count + 1); // ya calculation karo

// useReducer — "Kai Dabbe + Manager"
// Kai cheezein ek saath manage karo, manager ke through।
// jsxconst [{ loading, error, data }, dispatch] = useReducer(reducer, {
//   loading: false,
//   error: '',
//   data: []
// });

// dispatch({ type: 'FETCH_REQUEST' }); // manager ko batao kya karna hai

// Real Difference — API Call Example
// useState se karo — Messy ho jaata hai:
// jsxconst [loading, setLoading] = useState(false);
// const [error, setError] = useState('');
// const [products, setProducts] = useState([]);

// // Teen alag setters call karne padte hain
// const fetchData = async () => {
//   setLoading(true);      // 1
//   setError('');          // 2
//   try {
//     const { data } = await axios.get('/api/products');
//     setProducts(data);   // 3
//     setLoading(false);   // 4
//   } catch (err) {
//     setError(err.message); // 5
//     setLoading(false);     // 6
//   }
// }
// useReducer se karo — Clean aur organized:
// jsxconst [{ loading, error, products }, dispatch] = useReducer(reducer, {
//   loading: false, error: '', products: []
// });

// const fetchData = async () => {
//   dispatch({ type: 'FETCH_REQUEST' });  // ek line mein loading true
//   try {
//     const { data } = await axios.get('/api/products');
//     dispatch({ type: 'FETCH_SUCCESS', payload: data }); // ek line mein sab theek
//   } catch (err) {
//     dispatch({ type: 'FETCH_FAIL', payload: err }); // ek line mein error
//   }
// }