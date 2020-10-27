import React, { Component } from 'react';
import { UrlConstants } from '../../Service/UrlConstants';
import { GenericApiService } from '../../Service/GenericApiService';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

class NewAndUpdateCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: [],
            Loader: false
        }
    }

    componentDidMount() {
        this.getNewsList();
    }

    // to get notification list api 
    getNewsList = () => {
        var url;
        // if (JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup != 'Admin') {
           const userId = JSON.parse(sessionStorage.LoginUserObject).bcmUserId;
           url = UrlConstants.getNewsListByUserIdUrl + userId;
        // } else {
        //    url = UrlConstants.getNewsListUrl;
        // }
        this.setState({ Loader: true });

        GenericApiService.getAll(url).then(response => {
            if (response.data) {
                this.setState({
                    newsList: response.data,
                    Loader: false
                });
            }
        this.setState({ Loader: false });
        }).catch(error => {

        })
    }

    goToNewsPage = (news, index) => {

        this.props.history.push('/home/newsandupdates?id=' + news.bcmNotificationId);

    }

    convertTime(dateObj) {
        if (dateObj) {
            var timestamp = new Date(dateObj);
            var monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var date = new Date(timestamp.getTime() * 1000);

            var tempday = (date.getDate()).toString();

            const day = tempday.length !== 1 ? tempday : '0' + tempday;

            const obj = timestamp.toDateString().split(' ')[2] + ' ' + timestamp.toDateString().split(' ')[1]
            //  timestamp.getDate() + ' ' + monthNames[date.getMonth()+1] + ' ' + this.formatAM_PM(date);
            return obj;
        }
    }

    render() {
        const { Loader, newsList } = this.state;
        return (

            <ul className="news-list list-unstyled">
                {Loader ? <div className="loader">
                    <Spinner animation="grow" variant="dark" />
                </div> : null}
                {/* <li className="news read">										
                    <h6 className="news-title">Updates on COVID-19</h6>
                    <p>With 1,229 fresh cases in the last 24 hours, India's novel coronavirus count has increased to 21,700, according to the latest Ministry of Health...
                    </p>
                    <span className="news-timing">26 Apr, 9:36 pm</span>
                </li> */}
                {newsList.length != 0 ? newsList.map((news, index) =>
                    <li className="news unread" key={index} onClick={() => this.goToNewsPage(news, index)}>
                        <h6 className={news.isRead ? `news-title read-msg ` : 'news-title'}>{news.title}</h6>
                        <div className="news-description" dangerouslySetInnerHTML={{ __html: news.description }}></div>
                        <span className="news-timing">{this.convertTime(news.updatedOn)}</span>
                    </li>) : <div className="text-center " style={{ marginTop: 75 }}>No Records Found</div>}
            </ul>
        )
    }
}

export default withRouter(NewAndUpdateCard);