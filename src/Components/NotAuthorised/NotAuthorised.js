import React, { Component } from 'react';
import unauthorized from '../../assets/images/unauthorized-person.png';
class NoTAuthorised extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
           <div className="not-authosised-container">
                <div className="not-authosised">
                    <img src={unauthorized} alt="unauthorized person" />
                    <h5>You are not authorised person to access this screen</h5>
                </div>
           </div>
         );
    }
}
 
export default NoTAuthorised;