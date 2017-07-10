import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import bluePinImage from '../../assets/pin.png';
import redPinImage from '../../assets/pin_red.png';

class PinView extends React.Component {

    constructor(props) {
        super(props);
        props.item.pinFocused = false;
    }
    
    onTouchablePressed() {
        this.props.handlePinViewTouched(this.props.item, this.props.modalKey);
    }
    
    render() {
        const pinX = this.props.x - 6;
        const pinY = this.props.y - 25;
        var pinImage = this.props.item.pinFocused ? redPinImage : bluePinImage;
        
        return (
            <View style={{ position: 'absolute', left: pinX, top: pinY }}>
                <TouchableOpacity onPressIn={this.onTouchablePressed.bind(this)}>
                    <View>
                        <Image source={pinImage} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default PinView;
