import React, { Component } from 'react'
import CourseManipulation from './CourseManipulation';
import SectionManipulation from './SectionManipulation';
import TopicManipulation from './TopicManipulation';
import sharingService from '../../../Service/DataSharingService';

 class CourseManagement extends Component {
     constructor(props) {
         super(props)
     
         this.state = {
              activeComponent:1
         }
     }

     componentDidMount(){
        this.subscription = sharingService.getMessage().subscribe(message => {
            if (message) {
                if (window.location.href.includes('/home/datamanagement')) {
                    if(message.text=='activeCPT'){
                        var activeComponent = sessionStorage.activeCPT;
                        this.setState({ activeComponent }, () => {
                        });
                    }
                }
            }
        });
     }

     
     
    render() {
        const { activeComponent } = this.state;
        return (
            <div id="CourseManagement">
                
                {activeComponent==1? <CourseManipulation/>:null}
                {activeComponent==2? <TopicManipulation/>:null}
                {activeComponent==3? <SectionManipulation/>:null}
               
            </div>
        )
    }
}

export default CourseManagement
