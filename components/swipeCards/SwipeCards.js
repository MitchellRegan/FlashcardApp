import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated, PanResponder, TouchableOpacity, Image } from 'react-native';

//Styles
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Displays cards to display questions and answers that the user can swipe left or right on
 * Props: "cards" as an array of each card's question and answer data that the swipe cards display
 * */
export default class SwipeCards extends Component {
    constructor(props) {
        super(props);

        //Variable to hold the XY position for cards while they're being moved
        this.position = new Animated.ValueXY();

        //Interpolator used to rotate the top card based on the X position
        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3],
            outputRange: ['-15deg', '0deg', '15deg'],
            extrapolate: 'clamp'
        });

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        };

        //Interpolator used to make the "CORRECT" text become visible
        this.correctOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        //Interpolator used to make the "INCORRECT" text become visible
        this.incorrectOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        });

        //Interpolator to make the card under the top card fade in
        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        });

        //Interpolator to make the card under the top card grow in size
        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        });

        this.state = {
            cards: this.props.cards,
            currentIndex: 0,
            numCorrect: 0,
            numIncorrect: 0,
            showQuestion: true
        };
    }


    /**
     * Method called from TouchableOpacity to flip the current card to display either the question or the answer
     * */
    ToggleShowQuestion = function () {
        this.setState(prevState => {
            return ({
                ...prevState,
                showQuestion: !this.state.showQuestion
            });
        });
    }


    /**
     * Returns a render of the current card's data
     * */
    RenderCard = () => {
        return this.state.cards.map((item, i) => {
            //Not rendering cards in the stack that are above the current index
            if (i < this.state.currentIndex) {
                return null;
            }
            //Handling the position of the card at the top of the stack when showing the answer
            else if (i == this.state.currentIndex) {
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={i}
                        style={[this.rotateAndTranslate, styles.cardAnimView]}
                    >
                        {/*The CORRECT text on swipe left*/}
                        {(!this.state.showQuestion) && <Animated.View style={[{ opacity: this.correctOpacity }, styles.correctView]}>
                            <Text style={styles.correctText}>CORRECT</Text>
                        </Animated.View>}

                        {/*The INCORRECT text on swipe right*/}
                        {(!this.state.showQuestion) && <Animated.View style={[{ opacity: this.incorrectOpacity }, styles.incorrectView]}>
                            <Text style={styles.incorrectText}>INCORRECT</Text>
                        </Animated.View>}

                        {/*Displaying the Question side of the card*/}
                        {(this.state.showQuestion) && <View style={styles.cardImage}>
                            <Text style={styles.cardQuestionHeader}>QUESTION</Text>

                            <View style={styles.cardContentView}>
                                <Text style={styles.cardText}>{item.questionText}</Text>
                                {(item.questionImage != null) && <Image style={styles.cardPicture} source={{ uri: item.questionImage }} />}
                            </View>

                            <TouchableOpacity style={styles.cardFlipButton} onPress={() => this.ToggleShowQuestion()}>
                                <Text style={styles.cardFlipText}>Flip Card</Text>
                            </TouchableOpacity>
                        </View>}

                        {/*Displaying the Answer side of the card*/}
                        {(!this.state.showQuestion) && <View style={styles.cardImage}>
                            <Text style={styles.cardAnswerHeader}>ANSWER</Text>

                            <View style={styles.cardContentView}>
                                <Text style={styles.cardText}>{item.answerText}</Text>
                                {(item.answerImage != null) && <Image style={styles.cardPicture} source={{ uri: item.answerImage }} />}
                            </View>

                            <TouchableOpacity style={styles.cardFlipButton} onPress={() => this.ToggleShowQuestion()}>
                                <Text style={styles.cardFlipText}>Flip Card</Text>
                            </TouchableOpacity>
                        </View>}
                    </Animated.View>
                );
            }
            //Handling the immobile cards under the top card
            else if(i == this.state.currentIndex + 1) {
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={i}
                        style={[{ opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }] }, styles.cardAnimView]}
                    >
                        <View style={[styles.cardImage, { backgroundColor: item.color }]}>
                            <Text style={styles.cardQuestionHeader}>QUESTION</Text>

                            <View style={styles.cardContentView}>
                                <Text style={styles.cardText}>{item.questionText}</Text>
                            </View>
                        </View>
                    </Animated.View>
                );
            }
        }).reverse();
    }


    /**
     * Method called from ShowResults to shuffle the order of the deck and reset the current index
     * */
    ReshuffleDeck = function () {
        var shuffledCards = this.state.cards;

        //Randomly shuffling the order of the cards
        for (var i = shuffledCards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledCards[i];
            shuffledCards[i] = shuffledCards[j];
            shuffledCards[j] = temp;
        }

        this.setState(prevState => {
            return ({
                ...prevState,
                cards: shuffledCards,
                currentIndex: 0,
                numCorrect: 0,
                numIncorrect: 0,
                showQuestion: true
            });
        });
    }


    /**
     * Renders the results of the practice session and displays options for what to do next
     * */
    ShowResults = function () {
        return (
            <View style={styles.resultView}>
                <Text style={styles.resultTitleText}>Results</Text>
                <Text style={styles.resultText}>Correct: {this.state.numCorrect}</Text>
                <Text style={styles.resultText}>Incorrect: {this.state.numIncorrect}</Text>

                <TouchableOpacity style={styles.reshuffleButton} onPress={() => this.ReshuffleDeck()}>
                    <Text style={styles.reshuffleText}>Practice Again</Text>
                </TouchableOpacity>
            </View>
        );
    }


    UNSAFE_componentWillMount() {
        //Creating a new PanResponder and the events it sends out when created, moved, and released
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({x: gestureState.dx, y: gestureState.dy});
            },
            onPanResponderRelease: (evt, gestureState) => {
                //If the user swipes the image right
                if (gestureState.dx > (SCREEN_WIDTH / 2) && !this.state.showQuestion) {
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                        useNativeDriver: true
                    }).start(() => {
                        //Marking that the user got the current card correct, moving on to the next card in the stack, and displaying that card's question
                        this.setState({
                            currentIndex: this.state.currentIndex + 1,
                            numCorrect: this.state.numCorrect + 1,
                            numIncorrect: this.state.numIncorrect,
                            showQuestion: true
                        }, () => {
                            this.position.setValue({ x: 0, y: 0 });
                        })
                    })
                }
                //If the user swipes the image left
                else if (gestureState.dx < (-SCREEN_WIDTH / 2) && !this.state.showQuestion) {
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                        useNativeDriver: true
                    }).start(() => {
                        //Marking that the user got the current card incorrect, moving on to the next card in the stack, and displaying that card's question
                        this.setState({
                            currentIndex: this.state.currentIndex + 1,
                            numCorrect: this.state.numCorrect,
                            numIncorrect: this.state.numIncorrect + 1,
                            showQuestion: true
                        }, () => {
                            this.position.setValue({ x: 0, y: 0 });
                        })
                    })
                }
                //If the swipe doesn't go past the threshold to register as either correct or incorrect
                else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: true
                    }).start();
                }
            }
        });

        //Shuffling the card order
        this.ReshuffleDeck();
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.topBufferView} />

                <View style={styles.cardHolderView}>
                    {this.RenderCard()}

                    {(this.state.currentIndex >= this.state.cards.length) && this.ShowResults()}
                </View>

                <View style={styles.bottomBufferView} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultScreenBackground
    },

    topBufferView: {
        height: 10,
    },

    cardHolderView: {
        flex: 1
    },

    cardAnimView: {
        height: SCREEN_HEIGHT - 140,
        width: SCREEN_WIDTH,
        padding: 10,
        position: 'absolute',
    },

    cardImage: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'cover',
        borderRadius: 20,
        backgroundColor: '#fff',
        borderColor: '#777',
        borderWidth: 1,
    },

    cardQuestionHeader: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: Colors.incorrectColor,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.serif
    },

    cardAnswerHeader: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: Colors.correctColor,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.serif
    },

    cardContentView: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },

    cardText: {
        fontFamily: Fonts.serif,
        fontSize: 16,
        textAlign: 'center',
    },

    cardPicture: {
        height: SCREEN_WIDTH * 0.75,
        width: SCREEN_WIDTH * 0.75,
        alignSelf: 'center'
    },

    cardFlipButton: {
        padding: 15,
    },

    cardFlipText: {
        fontFamily: Fonts.serif,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    correctView: {
        transform: [{ rotate: "-30deg" }],
        position: "absolute",
        top: 80,
        left: 40,
        zIndex: 1000,
        backgroundColor: '#fff',
    },

    correctText: {
        borderWidth: 4,
        borderColor: Colors.correctColor,
        color: Colors.correctColor,
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10
    },

    incorrectView: {
        transform: [{ rotate: "30deg" }],
        position: "absolute",
        top: 80,
        right: 40,
        zIndex: 1000,
        backgroundColor: '#fff',
    },

    incorrectText: {
        borderWidth: 4,
        borderColor: Colors.incorrectColor,
        color: Colors.incorrectColor,
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10
    },

    bottomBufferView: {
        height: 30
    },

    resultView: {
        alignSelf: 'center',
        alignContent: 'center',
        flex: 1, 
    },

    resultTitleText: {
        fontFamily: Fonts.serif,
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        marginTop: 30,
    },

    resultText: {
        fontFamily: Fonts.serif,
        fontSize: 22,
    },

    reshuffleButton: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        backgroundColor: Colors.lightGrey,
        marginTop: 20,
        alignSelf: 'center',
    },

    reshuffleText: {
        fontFamily: Fonts.serif,
        fontSize: 22,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    }
});