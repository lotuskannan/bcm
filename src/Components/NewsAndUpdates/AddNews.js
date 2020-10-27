import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import { Col, Row, Button, Spinner } from 'react-bootstrap';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import ReactQuill from 'react-quill';
import { Multiselect } from 'multiselect-react-dropdown';
import 'react-quill/dist/quill.snow.css';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';


class AddNews extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            newsObject: this.props.feeds ? JSON.parse(this.props.feeds) : '',
            message: this.props.feeds ? JSON.parse(this.props.feeds).description : '',
            bcmUserGroupId: this.props.feeds ? JSON.parse(this.props.feeds).bcmUserGroup : '',
            fromAddress: 'Merit Group',
            titleName: this.props.feeds ? JSON.parse(this.props.feeds).title : '',
            isError: {
                titleName: "",
                bcmUserGroupId: "",
                message: '',
                fromAddress: '',
            },
            Loader: false,
            groupList: [],
            // selectedValue:[],
            objectArray: [],
            selectedValues: [],
            selectedFile: '',
            invalidFile: ''
        }
    }

    componentDidMount() {
        this.getGroupList();
        if (this.state.newsObject) {
            this.getNewsById();
        }

    }
    getNewsById = () => {
        const url = UrlConstants.getNewsByIdUrl + this.state.newsObject.bcmNotificationId;
        GenericApiService.getAll(url).then(response => {
            if (response.data) {
                this.setState({
                    newsObject: response.data,
                    selectedValues: response.data.bcmNotificationGroup
                })
            }
        })
    }
    fromAddressValidator = (Param) => {

        var returnMsg = '';
        if (Param.length == 0 || Param == '') {
            returnMsg = 'From address is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }


    titleNameValidator = (Param) => {

        var returnMsg = '';
        if (Param.length == 0 || Param == '') {
            returnMsg = 'Title name is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    groupNameValidator = (Param) => {


        var returnMsg = '';
        if (this.state.selectedValues.length == 0) {
            returnMsg = 'Please select group name';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    MessageValidator = (Param) => {

        var returnMsg = '';
        if (Param.length == 0 || Param == '<p><br></p>') {
            returnMsg = 'Message is required.';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    formValChange = e => {
        // e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "titleName":
                isError.titleName = this.titleNameValidator(value)
                break;
            case "message":
                isError.message = this.MessageValidator(value)
                break;
            case "fromAddress":
                isError.fromAddress = this.fromAddressValidator(value)
                break;
            default:
                break;
        }


        this.setState({
            isError,
            [name]: value
        });
    };


    saveNotification = (e) => {

        // e.preventDefault();
        if (this.validForm() && this.state.selectedValues.length !== 0) {
            var obj = this.getPayload();
            var file = this.state.selectedFile;
            var formData = new FormData();
            formData.append('bcmNotification', JSON.stringify(obj));
            formData.append('fileAttachment', file)
            const payload = formData;
            this.setState({ Loader: true });
            GenericApiService.saveFormData(UrlConstants.saveNewsUrl, payload).then(response => {
                this.setState({ Loader: false });
                if (response.status.success === 'SUCCESS') {
                    this.setState({ Loader: false });
                    if (this.props.newRecord) {
                        const message = `News & Updates published successfully`
                        this.props.closeModal(message);
                    } else {
                        const message = `News update was successfull for ${this.state.titleName}`
                        this.props.closeModal(message);
                    }
                }
            }).catch(error => {

            })
        } else {
            let isError = { ...this.state.isError };
            isError.titleName = this.titleNameValidator(this.state.titleName);
            isError.fromAddress = this.titleNameValidator(this.state.fromAddress);
            isError.message = this.MessageValidator(this.state.message);
            this.setState({ isError: isError });
        }
    }

    validForm() {
        if (this.titleNameValidator(this.state.titleName) == '' &&
            this.MessageValidator(this.state.message) == '' &&
            this.titleNameValidator(this.state.fromAddress) == '' && this.state.invalidFile == '') {
            return true;
        } else {
            return false;
        }
    }

    getPayload() {
        var user = JSON.parse(sessionStorage.getItem('LoginUserObject'));
        var updateOn = new Date().toISOString();
        var obj;
        var groubObject = [];
        var tempIndex = [];
        for (var j = 0; j < this.state.objectArray.length; j++) {
            for (var i = 0; i < this.state.selectedValues.length; i++) {
                if (this.state.objectArray[j].bcmUserGroupId == this.state.selectedValues[i].bcmUserGroupId) {
                    groubObject.push({
                        "bcmUserGroupId": this.state.groupList[j].bcmUserGroupId,
                        "userGroup": this.state.groupList[j].userGroup,
                        "description": this.state.groupList[j].description,
                        "bcmAppPermission": this.state.groupList[j].bcmAppPermission,
                        "isActive": this.state.groupList[j].isActive,
                        "createdBy": this.state.groupList[j].createdBy,
                        "createdOn": this.state.groupList[j].createdOn,
                        "updatedOn": this.state.groupList[j].updatedOn,
                        "updatedBy": this.state.groupList[j].updatedBy
                    });
                }
            }
        }

        if (this.props.newRecord) {
            obj = {
                title: this.state.titleName,
                description: this.state.message,
                smsNotification: 0,
                emailNotification: 0,
                mobileAppNotification: 0,
                voiceNotification: 0,
                notifyAll: 0,
                isActive: true,
                createdBy: user.bcmUserId,
                createdOn: updateOn,
                updatedOn: updateOn,
                updatedBy: user.bcmUserId,
                informationFrom: this.state.fromAddress,
                bcmNotificationGroup: groubObject

            };
        }
        else {
            obj = {
                title: this.state.titleName,
                description: this.state.message,
                smsNotification: this.state.newsObject.smsNotification,
                emailNotification: this.state.newsObject.emailNotification,
                mobileAppNotification: this.state.newsObject.mobileAppNotification,
                voiceNotification: this.state.newsObject.voiceNotification,
                notifyAll: this.state.newsObject.notifyAll,
                isActive: true,
                createdBy: this.state.newsObject.createdBy,
                createdOn: this.state.newsObject.createdOn,
                updatedOn: updateOn,
                updatedBy: user.bcmUserId,
                bcmNotificationId: this.state.newsObject.bcmNotificationId,
                informationFrom: this.state.fromAddress,
                bcmNotificationGroup: groubObject
            };
        }
        return obj;
    }

    getGroupList = () => {
        this.setState({ Loader: true });
        GenericApiService.getAll(UrlConstants.getGroupList).then(response => {
            if (response.data) {
                this.setState({
                    groupList: response.data
                });

                var tmpObjArry = [];
                var tempSelectedVal = [];


                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].userGroup != null) {
                        tmpObjArry.push({
                            'userGroup': response.data[i].userGroup,
                            'bcmUserGroupId': response.data[i].bcmUserGroupId
                        });
                        if (response.data[i].userGroup == "Admin") {
                            tempSelectedVal.push({
                                'userGroup': response.data[i].userGroup,
                                'bcmUserGroupId': response.data[i].bcmUserGroupId
                            });
                        }
                    }
                }

                this.setState({ objectArray: tmpObjArry });
                this.setState({ selectedValues: tempSelectedVal });

                this.setState({ Loader: false });
            }

            this.setState({ Loader: false });
        }).catch(error => {

        })
    }
    onSelect = (selectedList, selectedItem) => {
        this.setState({ selectedValues: selectedList });
    }
    onRemove = (selectedList, removedItem) => {
        this.setState({ selectedValues: selectedList });
    }
    onSelectFile = (event) => {
        if (event.target.files[0]) {
            this.setState({ invalidFile: '' });
            let fileName = event.target.files[0].name;
            if (!fileName.match(/\.(pdf)$/)) {
                this.setState({ invalidFile: 'Please select only pdf.' });
            } else {
                if (Math.round((event.target.files[0].size / 1024)) > 1024) {
                    this.setState({ invalidFile: 'PDF file size allowed maximum 1 MB' });
                } else {
                    console.log(event.target.files[0])
                    this.setState({ selectedFile: event.target.files[0] });
                }
            }
        } else {
            this.setState({ invalidFile: '', selectedFile: '' });
        }
    }
    render() {
        const modules = {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'code-block'],
                ['clean']
            ],
        }

        const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'code-block',
        ]


        const { isError, Loader, groupList, bcmUserGroupId, selectedValue, invalidFile } = this.state;
        return (
            <Form className="send-mail-form" noValidate>
                {Loader ? <div className="loader">
                    <Spinner animation="grow" variant="dark" />
                </div> : null}
                <Form.Row>
                    <Form.Group className="col-12" controlId="formGridPassword">
                        <Form.Label>From :</Form.Label>
                        <Form.Control type="text" name="fromAddress"
                            placeholder="From :" onChange={this.formValChange.bind(this)}
                            defaultValue={this.state.fromAddress} className="mail-subject" />
                    </Form.Group>
                    <div className="col-12">  {isError.fromAddress.length > 0 && (
                        <p className="error-msg error-grid">{isError.fromAddress}</p>
                    )}</div>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="formGridEmail" className="email active col-12">
                        <Form.Label>To :</Form.Label>
                        <Multiselect className="multiSelectMail"
                            options={this.state.objectArray} // Options to display in the dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove}
                            displayValue="userGroup"
                            name="bcmUserGroupId"
                            id="bcmUserGroupId"
                            selectedValues={this.state.selectedValues}
                        />

                    </Form.Group>
                    <div className="col-12"> {this.state.selectedValues.length == 0 ? (
                        <p className="error-msg error-grid">
                            Please select group name
                        </p>
                    ) : null}</div>
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-12" controlId="formGridPassword">
                        <Form.Label>Title :</Form.Label>
                        <Form.Control type="text" name="titleName"
                            onChange={this.formValChange.bind(this)}
                            defaultValue={this.state.titleName} className="mail-subject" />

                    </Form.Group>
                    <div className="col-12">  {isError.titleName.length > 0 && (
                        <p className="error-msg error-grid">{isError.titleName}</p>
                    )}</div>
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-12">
                        <Form.Label>Upload PDF :</Form.Label>
                        <Form.Control type="file" accept={'application/pdf'} name="titleName" onChange={this.onSelectFile} className="mail-subject add-pdf-file" />
                    </Form.Group>
                    <div className="col-12">  {invalidFile.length > 0 && (
                        <p className="error-msg error-grid">{invalidFile}</p>
                    )}</div>

                </Form.Row>
                <Row className="mx-0 editor-row">
                    <ReactQuill defaultValue={this.state.message}
                        onChange={(e) => this.formValChange({ target: { name: "message", value: e } })}
                        modules={modules}
                        formats={formats}
                    />
                    {isError.message.length > 0 && (
                        <Form.Text className="error-msg editor-error">{isError.message}</Form.Text>
                    )}
                    <div className="forward-btn">
                        <Button variant="secondary" className={this.validForm() == true && this.state.selectedValues.length != 0
                            ? "greenBg" : ''} onClick={this.saveNotification}>
                            {'Publish'}</Button>
                    </div>

                </Row>
            </Form>
        );
    }

}

export default AddNews;
