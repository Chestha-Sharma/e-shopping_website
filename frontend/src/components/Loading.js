import { Spinner } from "react-bootstrap";

export default function Loading(){
        return(<Spinner animation="border" role="status">
            {/* if spinner not works then span will shown */}
        <span className="visually-hidden">Loading...</span>
      </Spinner>);
}