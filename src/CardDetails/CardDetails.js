import React from 'react';
import { 
    View, 
    Text, 
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import CardToolbar from './CardToolbar';
import CardCanvas from './CardCanvas';
import ActionSheet from 'react-native-actionsheet'
import Modal from 'react-native-modalbox';

const CANCEL_INDEX = 0
const options = [ 'Cancel', 'Selection', 'Free Answer' ]
const title = 'Which type of quiz?'

const SELECTION_QUIZ = 1;
const FREE_ANSWER_QUIZ = 2;

class CardDetails extends React.Component {
    
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.cardData.title
    });
    
    constructor(props) {
        super(props);
        this.state = {
            selectedQuizType: 0,
            isSelectionQuizRunning: false,
            isFreeAnswerQuizRunning: false,
            quizData: props.navigation.state.params.cardData.items,
            itemCount: props.navigation.state.params.cardData.items.length,
            currentItem: null,
            keyboardHeight: 0,
            backdropPressToClose: false
        }
    }
    
    componentWillMount () {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    keyboardDidShow = (event) => {
        console.log('keyboardDidShow');
        this.setState({
            keyboardHeight: event.endCoordinates.height
        });
    };

    keyboardDidHide = (event) => {
        this.setState({
            keyboardHeight: 0
        });
    };

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

    cardData() {
        return this.props.navigation.state.params.cardData;
    }

    startQuiz(type) {
        if (type == SELECTION_QUIZ) {
            this.setState({
                selectedQuizType: SELECTION_QUIZ
            }, () => {
                this.nextQuestion();
            });
        } else if (type == FREE_ANSWER_QUIZ) {
            this.setState({
                selectedQuizType: FREE_ANSWER_QUIZ
            }, () => {
                this.nextQuestion();
            });
        }
    }

    nextQuestion() {
        if (this.state.selectedQuizType == SELECTION_QUIZ) {
            this.nextSelectionQuestion();
        } else if (this.state.selectedQuizType == FREE_ANSWER_QUIZ) {
            this.nextFreeAnswerQuestion()
        }
    }

    processNextQuizQuestion() {

        var quizData;

        // before moving on to next question, check if current item was selected incorrectly and append to end of quizData
        if (this.state.currentItem && this.state.currentItem.missedQuestion) {
            quizData = this.state.quizData.slice();
            var currentItem = Object.assign({}, this.state.currentItem); // copy object
            currentItem.questionWasMissed = true;
            currentItem.missedQuestion = false;
            quizData.push(currentItem);

            this.setState({
                quizData: quizData
            });
        }

        // check if we need to end the quiz here
        if (this.state.quizData.length == 0) {
            this.setState({
                selectedQuizType: 0,
                isSelectionQuizRunning: false,
                isFreeAnswerQuizRunning: false,
                quizData: this.cardData().items,
                itemCount: this.cardData().items.length,
                currentItem: null
            });
            this.CardToolbar.changeToolbarState('normal');
            return {};
        }

        // select a random item and remove it
        // don't select a missed question until every question is attempted
        quizData = quizData || this.state.quizData.slice();
        var length = this.state.itemCount > 0 ? this.state.itemCount : quizData.length;
        var randomIndex = Math.floor(Math.random()*length);
        var item = quizData[randomIndex];
        quizData.splice(randomIndex, 1);

        if (item.questionWasMissed) {
            this.CardToolbar.changeToolbarState('missed');
        } else {
            this.CardToolbar.changeToolbarState('normal');
        }

        return {item, quizData};
    }

    nextSelectionQuestion() {

        let { item, quizData } = this.processNextQuizQuestion();
        if (item == null) { return; } // quiz ended

        // console.log('quiz data:');
        // console.log(quizData);
        // console.log('current question:');
        // console.log(item);

        this.setState({
            isSelectionQuizRunning: true,
            isFreeAnswerQuizRunning: false,
            currentItem: item,
            itemCount: --this.state.itemCount
        }, () => {
            this.setState({
                quizData: quizData
            })
        });
    }

    onSelectionQuizItemSelection(item, key) {
        
        if (this.state.isFreeAnswerQuizRunning == true) {
            return;
        }

        if (this.state.isSelectionQuizRunning == false) {
            this.refs[key].open();
            return;
        }

        if (this.state.currentItem.title == item.title) {
            this.state.currentItem.missedQuestion = false;
            this.CardToolbar.changeToolbarState('correct');
        } else {
            this.state.currentItem.missedQuestion = true;
            this.CardToolbar.changeToolbarState('incorrect');
        }
    }

    nextFreeAnswerQuestion() {
        
        if (this.state.currentItem) {
            this.state.currentItem.pinFocused = false;
        }

        let { item, quizData } = this.processNextQuizQuestion();
        if (item == null) { return; } // quiz ended

        item.pinFocused = true;

        // console.log('quiz data:');
        // console.log(quizData);
        // console.log('current question:');
        // console.log(item);

        this.setState({
            isSelectionQuizRunning: false,
            isFreeAnswerQuizRunning: true,
            currentItem: item,
            itemCount: --this.state.itemCount
        }, () => {
            this.setState({
                quizData: quizData
            })
        });
    }

    onFreeAnswerInputConfirmed(text) {

        // console.log(this.state.currentItem.title);
        // console.log(text);

        var title = this.state.currentItem.title;
        var altTitles = this.state.currentItem.altTitles;

        if (text == title) {
            this.state.currentItem.missedQuestion = false;
            this.CardToolbar.changeToolbarState('correct');
        } else {
            this.state.currentItem.missedQuestion = true;
            this.CardToolbar.changeToolbarState('incorrect');
        }
    }

    handleCanvasTouched() {
        console.log('handleCanvasTouched');
        Keyboard.dismiss();
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                
                <CardCanvas isSelectionQuizRunning={this.state.isSelectionQuizRunning}
                            isFreeAnswerQuizRunning={this.state.isFreeAnswerQuizRunning}
                            cardData={this.cardData()}
                            keyboardHeight={this.state.keyboardHeight}
                            handleSelectionQuizItemSelection={(item, key) => this.onSelectionQuizItemSelection(item, key)} />

                <Animated.View style={{paddingBottom: this.state.keyboardHeight}}>

                    <CardToolbar ref={o => this.CardToolbar = o}
                                isSelectionQuizRunning={this.state.isSelectionQuizRunning}
                                isFreeAnswerQuizRunning={this.state.isFreeAnswerQuizRunning}
                                currentItem={this.state.currentItem}
                                handleStartQuzBtnPressed={(type) => this.startQuiz(type)}
                                handleNextQuestionPressed={this.nextQuestion.bind(this)}
                                handleFreeAnswerQuizSubmit={(text) => this.onFreeAnswerInputConfirmed(text)} />
                </Animated.View>

                {this.cardData().items.map((item, i) => {
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
        );
    }
}

const styles = StyleSheet.create({
    
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

export default CardDetails;
