import React from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import PinView from './PinView';
import Dimensions from 'Dimensions';
import { images } from '../constants';
import sf from 'scale-factor';

class CardCanvas extends React.Component {

    constructor(props) {
        super(props);
    }

    onPinViewTouched(item, key) {
        this.props.handleSelectionQuizItemSelection(item, key);
    }

    render() {

        const src = images[this.props.cardData.image];
        const items = this.props.cardData.items;
        
        console.log('keyboardHeight');
        console.log(this.props.keyboardHeight);

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
                            cropHeight={canvasHeight -  this.props.keyboardHeight}
                            imageWidth={canvasWidth}
                            imageHeight={canvasHeight}
                            maxOverflow={200}
                            leaveDistance={200}
                            style={{backgroundColor: 'red'}}>
                
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

                        </View>
                    </TouchableWithoutFeedback>
                
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
        backgroundColor: 'white'
    }
});

export default CardCanvas;
