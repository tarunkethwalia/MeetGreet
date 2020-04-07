import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import "./CropModel.css";
import ReactCrop from "react-image-crop";
import ImageService from "../../../../services/image-service";
import userService from "../../../../services/user-services";
import auth from '../../../../auth/auth';
import userStore from "../../../../Store/stores/user-store";

class CropModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crop: {
                unit: '%',
                width: 50,
                aspect: 4 / 4,
            },
            croppedImageUrl: ''
        }
    }

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({...this.state, crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({...this.state, croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        return new Promise((resolve,reject) => {
            resolve(base64Image);
        });
    }

    changeProfileDP = () => {
        let userData = this.props.userdata;
        let files = this.state.croppedImageUrl;
        var image = new Image();
        image.src = files;
        let formData = new FormData();
        formData.append('file', image);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        ImageService.upload(formData, config).then(DPUrl => {
            ImageService.ProfilePic(userData._id, DPUrl.data).then(() => {
                userService.fetchData(userData._id).then((currentUser) => {
                    auth.updateAuthencity(true, currentUser, () => {
                        userStore.dispatch({type: 'USERS_DATA', result: currentUser.data.data});
                        console.log(userStore.getState().root.user);
                        // this.props.onHide();
                        // window.location.reload(false);
                    });
                }, er => {
                    console.log(er);
                });
            }, error => {
                console.log(error);
            });
        }, err => {
            console.log(err);
        });
    };

    //Function Not Available
    handleNotAvailable = () => {
        alert('This feature is currently unavailable.');
    };
    render() {
        console.log(this.state);
        const { src } = this.props;
        const { crop, croppedImageUrl } = this.state;
        return (
            <Modal
                {...this.props}
                show={this.props.show}
                size="xl"
                // onHide={() => setShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header>
                    <Modal.Title>
                        <div className="cropModelHeader">
                            <h3>Crop Image</h3>
                            <i className="fas fa-times" onClick={this.props.onHide}></i>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modelCBody">
                    {src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            className="CropBlock"
                        />
                    )}
                    {croppedImageUrl && (
                        <div className="showCropImage">
                            <div className="fixedSizedImage">
                                <img alt="Crop" src={croppedImageUrl} className="croppedImg"/>
                            </div>
                            <div className="sendCropBtn">
                                <button className='btn btn-success' onClick={this.changeProfileDP}>Done</button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

export default CropModel;