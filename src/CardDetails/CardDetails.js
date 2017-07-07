import React from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import CardToolbar from './CardToolbar';
import CardCanvas from './CardCanvas';
import ActionSheet from 'react-native-actionsheet'

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
            currentItem: null
        }
    }

    cardData() {
        return this.props.navigation.state.params.cardData;
    }
    
    componentDidMount() {}

    startQuiz() {
        this.ActionSheet.show();
    }

    handleActionSheetPress(i) {
        if (i == 1) {
            this.setState({
                selectedQuizType: SELECTION_QUIZ
            }, () => {
                this.nextQuestion();
            });
        } else if (i == 2) {
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

        console.log('quiz data:');
        console.log(quizData);
        console.log('current question:');
        console.log(item);

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

        console.log('quiz data:');
        console.log(quizData);
        console.log('current question:');
        console.log(item);

        item.pinFocused = true;

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

        console.log(this.state.currentItem.title);
        console.log(text);

        if (text == this.state.currentItem.title) {
            this.state.currentItem.missedQuestion = false;
            this.CardToolbar.changeToolbarState('correct');
        } else {
            this.state.currentItem.missedQuestion = true;
            this.CardToolbar.changeToolbarState('incorrect');
        }
    }
    
    render() {
        return (
            <KeyboardAvoidingView 
                style={{backgroundColor: 'white', flex: 1}} 
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}>
                
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.handleActionSheetPress.bind(this)}
                    />

                <CardCanvas isSelectionQuizRunning={this.state.isSelectionQuizRunning}
                            isFreeAnswerQuizRunning={this.state.isFreeAnswerQuizRunning}
                            cardData={this.cardData()}
                            handleSelectionQuizItemSelection={(item, key) => this.onSelectionQuizItemSelection(item, key)} />

                <CardToolbar ref={o => this.CardToolbar = o}
                            isSelectionQuizRunning={this.state.isSelectionQuizRunning}
                            isFreeAnswerQuizRunning={this.state.isFreeAnswerQuizRunning}
                            currentItem={this.state.currentItem}
                            handleStartQuzBtnPressed={this.startQuiz.bind(this)}
                            handleNextQuestionPressed={this.nextQuestion.bind(this)}
                            handleFreeAnswerQuizSubmit={(text) => this.onFreeAnswerInputConfirmed(text)} />
            </KeyboardAvoidingView>
        );
    }
}

export default CardDetails;
