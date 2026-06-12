import { Alert } from "react-bootstrap";

 
export default function Msg(props){
        return(
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
        )
}