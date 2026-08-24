import {axiosInstance} from '../lib/axios.js';
import { useContext, useEffect, useReducer } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Chart from 'react-google-charts';
import Loading from '../components/Loading.js';
import Msg from '../components/MassageBox.js';
import { Store } from '../store.js';
import { toast } from 'react-toastify';
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
           const {data} = await axiosInstance.get('/api/order/summary',{
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

 