import React from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import PinView from './PinView';
import Modal from 'react-native-modalbox';
import Dimensions from 'Dimensions';
import { images } from '../constants';
import sf from 'scale-factor';

class CardCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backdropPressToClose: false
        }
    }

    onPinViewTouched(item, key) {

        if (this.props.isSelectionQuizRunning) {
            this.props.handleSelectionQuizItemSelection(item, key);
        } else {
            this.refs[key].open();
        }
    }

    onModalOpened() {
        this.setState({
            backdropPressToClose: true
        });
    }
    
    onModalClosed() {
        this.setState({
            backdropPressToClose: false
        });
    }

    render() {

        const src = images[this.props.cardData.image];
        const items = this.props.cardData.items;
        
        const offset = (Platform.OS === 'ios' ? 64 : 80) + 43;
        const canvasWidth = Dimensions.get('window').width;
        const canvasHeight = Dimensions.get('window').height - offset;
        const imageWidth = this.props.cardData.width;
        const imageHeight = this.props.cardData.height;
        
        const params = {
            // width & height of the source image
            originalWidth: imageWidth,
            originalHeight: imageHeight,
            
            // width & height of the target image
            desiredWidth: canvasWidth,
            desiredHeight: canvasHeight,
            
            // scale options
            scaleMode: sf.mode.fit,
            modeModifier: sf.modifier.none
        };
        
        const factors = sf.calc(params);
        
        const newImgWidth = imageWidth * factors.factorX;
        const newImgHeight = imageHeight * factors.factorY;
        
        const startX = (canvasWidth > newImgWidth) ? (canvasWidth / 2.0) - (newImgWidth / 2.0) : 0;
        const startY = (canvasHeight > newImgHeight) ? (canvasHeight / 2.0) - (newImgHeight / 2.0) : 0;

        return (
            <View style={styles.container}>
                <ImageZoom cropWidth={canvasWidth}
                            cropHeight={canvasHeight}
                            imageWidth={canvasWidth}
                            imageHeight={canvasHeight}
                            style={{backgroundColor: 'red'}}>
                
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                        <Image style={{width:newImgWidth, height:newImgHeight}} source={src}/>
                        
                        {items.map((item, i) => {
                            return (
                                <PinView key={`item${i}`}
                                        modalKey={`modal${i}`}
                                        item={item}
                                        x={(item.x * factors.factorX + startX)}
                                        y={(item.y * factors.factorY + startY)}
                                        handlePinViewTouched={(item, key) => this.onPinViewTouched(item, key)}>
                                </PinView>
                            );
                        })}
                        
                        {items.map((item, i) => {
                            const modalHeight = (item.height > 200) ? item.height : 130;
                            return (
                                <Modal style={[styles.modal, {height: modalHeight} ]}
                                        position={"center"}
                                        key={`modal${i}`}
                                        ref={`modal${i}`}
                                        backdropPressToClose={this.state.backdropPressToClose}
                                        onOpened={this.onModalOpened.bind(this)}
                                        onClosed={this.onModalClosed.bind(this)} >
                                    <Text style={styles.modalText}>{item.title}</Text>
                                    <Text style={styles.modalText2}>{item.info}</Text>
                                </Modal>
                            );
                        })}
                    </View>
                
                </ImageZoom>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: 350
    },
    
    modalText: {
        color: "black",
        fontSize: 22,
        marginTop: 35,
    },
    
    modalText2: {
        color: "black",
        fontSize: 12,
        padding: 15,
    }
});

export default CardCanvas;
