import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Toolbar from '../Views/Toolbar';

class CardToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quizToolbarBgColor: null,
            quizToolbarTextColor: 'black',
            textInputTextColor: 'black',
            freeAnswerText: ''
        }
    }

    onHidePinsPressed() {}
    
    onStartQuizPressed() {
        this.props.handleStartQuzBtnPressed();
    }
    
    onNextPagePressed() {}

    onNextQuestionPressed() {
        this.setState({
            freeAnswerText: ''
        });
        this.props.handleNextQuestionPressed();
    }

    changeToolbarState(state) {
        switch(state) {

            case "correct":
                this.setState({
                    quizToolbarBgColor: 'green',
                    quizToolbarTextColor: 'white',
                    textInputTextColor: 'white'
                });
                break;

            case "incorrect":
                this.setState({
                    quizToolbarBgColor: 'red',
                    quizToolbarTextColor: 'white',
                    textInputTextColor: 'white'
                });
                break;
            
            case "missed":
                this.setState({
                    quizToolbarBgColor: 'goldenrod',
                    quizToolbarTextColor: 'white',
                    textInputTextColor: 'white'
                });
                break;
                
            default:
                this.setState({
                    quizToolbarBgColor: null,
                    quizToolbarTextColor: 'black',
                    textInputTextColor: 'black'
                });
        }
    }

    onFreeAnswerConfirmBtnPressed() {
        this.props.handleFreeAnswerQuizSubmit(this.state.freeAnswerText);
    }

    render() {
        return (
            <View>
                { this.props.isSelectionQuizRunning == true ?

                    // SELECTION QUIZ STARTED
                    <Toolbar bgColor={this.state.quizToolbarBgColor}>
                        <View style={styles.toolbarItem}>
                            <Text style={{color: this.state.quizToolbarTextColor, fontWeight: 'bold'}}>Find: {this.props.currentItem.title}</Text>
                        </View>
                        <TouchableOpacity onPress={this.onNextQuestionPressed.bind(this)}>
                            <View style={styles.toolbarItem}>
                                <Text style={{color: this.state.quizToolbarTextColor, fontWeight: 'bold'}}>></Text>
                            </View>
                        </TouchableOpacity>
                    </Toolbar>

                    :

                    this.props.isFreeAnswerQuizRunning == true ?
                    
                    // FREE ANSWER QUIZ STARTED
                    <Toolbar bgColor={this.state.quizToolbarBgColor}>
                        <TextInput style={[styles.textInput, {color: this.state.textInputTextColor}]}
                                        onChangeText={(freeAnswerText) => this.setState({freeAnswerText})}
                                        placeholder='Enter name of red pin'
                                        value={this.state.freeAnswerText} />
                        <TouchableOpacity onPress={this.onFreeAnswerConfirmBtnPressed.bind(this)}>
                            <View style={styles.toolbarItem}>
                                <Text style={{color: this.state.quizToolbarTextColor, fontWeight: 'bold'}}>✓</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onNextQuestionPressed.bind(this)}>
                            <View style={styles.toolbarItem}>
                                <Text style={{color: this.state.quizToolbarTextColor, fontWeight: 'bold'}}>></Text>
                            </View>
                        </TouchableOpacity>
                    </Toolbar>

                    :

                    // DEFAULT STATE
                    <Toolbar>
                        <TouchableOpacity onPress={this.onHidePinsPressed.bind(this)}>
                            <View style={styles.toolbarItem}><Text>Previous</Text></View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={this.onStartQuizPressed.bind(this)}>
                            <View style={styles.toolbarItem}><Text style={{fontWeight: 'bold'}}>Start Quiz</Text></View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={this.onNextPagePressed.bind(this)}>
                            <View style={styles.toolbarItem}><Text>Next &nbsp;</Text></View>
                        </TouchableOpacity>
                    </Toolbar>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    toolbarItem: {
        paddingHorizontal: 15
    },

    textInput: {
        flex: 1,
        paddingHorizontal: 10
    }
});

export default CardToolbar;
