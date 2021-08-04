import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Alert, Dimensions } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';
//Icons
import ThreeDotMenuIcon from '../assets/icons/ThreeDotMenu_icon.svg';

//The screen width of this user's device
const SCREENWIDTH = Dimensions.get("window").width;

/**
 * Displays all of the information for a specific flashcard
 * Props: "cardIndex" for which card this is in the set, and "setIndex" for which set this card belongs to
 * */
export default class ViewCardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionText: '',
            questionImage: null,
            answerText: '',
            answerImage: null,
            correct: 0,
            incorrect: 0
        }
    }


    /**
     * Function to load all of the card data from the AsyncStorageLibrary
     * */
    LoadCardData = function () {
        AsyncStorageLibrary.RetrieveAllSets()
            .then(data => {
                //Getting our specific card's data from the entire set list
                var cardData = data.sets[this.props.route.params.setIndex].cards[this.props.route.params.cardIndex];
                //Storing the card's data in our state
                this.setState(prevState => {
                    return ({
                        questionText: cardData.questionText,
                        questionImage: cardData.questionImage,
                        answerText: cardData.answerText,
                        answerImage: cardData.answerImage,
                        correct: cardData.correct,
                        incorrect: cardData.incorrect
                    });
                })
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("ViewCardScreen.LoadCardData ERROR", error);
            })
    }


    /**
     * Finds the percentage of times this user has correctly guessed this card's answer
     * @returns {string} A string to display the correct percentage
     * */
    FindPercentCorrect = function () {
        if (this.state.incorrect + this.state.correct == 0) {    
            return "0%";
        }

        var percent = this.state.correct / (this.state.correct + this.state.incorrect);
        percent *= 10;
        return "" + Math.round(percent) + "%";
    }


    /**
     * Creates a prompt to make sure the user really wants to delete this card
     * */
    PromptDeleteCard = function () {
        Alert.alert(
            "Are You Sure?",
            "This action cannot be undone",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    style: "destructive",
                    onPress: () => this.DeleteCard()
                }
            ]
        );
    }


    /**
     * Called from a user prompt to delete this card from the set it belongs to
     * */
    DeleteCard = function () {
        AsyncStorageLibrary.DeleteCard(this.props.route.params.setIndex, this.props.route.params.cardIndex)
            .then(() => {
                this.props.navigation.goBack();
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("ViewCardScreen.DeleteCard ERROR", error);
            })
    }


    /*
     * Called from the ThreeDotMenuIcon to change the data stored in this card
     * */
    EditCard = function () {
        this.props.navigation.navigate("EditCard", {
            setIndex: this.props.route.params.setIndex,
            cardIndex: this.props.route.params.cardIndex,
            questionText: this.state.questionText,
            questionImage: this.state.questionImage,
            answerText: this.state.answerText,
            answerImage: this.state.answerImage,
        });
    }


    /**
     * Method called when this component is initially loaded
     * */
    componentDidMount() {
        this.LoadCardData();

        this.reload = this.props.navigation.addListener('focus', () => {
            this.LoadCardData();
        });
    }


    /**
     * Method called when this component is unloaded
     * */
    componentWillUnmount() {
        this.reload();
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header navigation={this.props.navigation} showBackButton={true} />

                <Menu style={styles.menuButton}>
                    <MenuTrigger>
                        <ThreeDotMenuIcon height={25} width={25}/>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => this.EditCard()}>
                            <Text style={styles.menuEditButton}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => this.PromptDeleteCard()} >
                            <Text style={styles.menuDeleteText}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.textBlockView}>
                        <Text style={styles.headerText}>Question:</Text>

                        <Text
                            style={styles.contentText}
                            numberOfLines={5}
                            textAlignVertical={"top"}
                        >
                            {this.state.questionText}
                        </Text>
                    </View>

                    {(this.state.questionImage != null) && <Image
                        style={styles.image}
                        source={{ uri: this.state.questionImage }}
                    />}

                    <View style={styles.textBlockView}>
                        <Text style={styles.headerText}>Answer:</Text>

                        <Text
                            style={styles.contentText}
                            numberOfLines={5}
                            textAlignVertical={"top"}
                        >
                            {this.state.answerText}
                        </Text>
                    </View>

                    {(this.state.answerImage != null) && <Image
                        style={styles.image}
                        source={{ uri: this.state.answerImage }}
                    />}

                    <View style={styles.percentageView}>
                        <Text style={styles.timesStudiedText}>Times Guessed Correctly:</Text>
                        <Text style={styles.percentText}>{this.FindPercentCorrect()}</Text>
                    </View>
                </ScrollView>

                {/*<View style={styles.editDeleteView}>
                    <TouchableOpacity style={styles.deleteCardButton} onPress={() => this.PromptDeleteCard()}>
                        <Text style={styles.editCardButtonText}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editCardButton} onPress={() => this.EditCard()}>
                        <Text style={styles.editCardButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultScreenBackground
    },

    menuButton: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 5,
        marginBottom: -20,
    },

    menuEditButton: {
        fontSize: 18,
    },

    menuDeleteText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.redText
    },

    scrollView: {
        margin: 20,
        marginTop: 0,
    },

    textBlockView: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 10,
    },

    headerText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 20,
    },

    contentText: {
        fontFamily: Fonts.serif,
        fontSize: 16,
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2
    },

    image: {
        borderWidth: 1,
        borderColor: '#000',
        margin: 3,
        height: SCREENWIDTH - 80,
        width: SCREENWIDTH - 80,
        alignSelf: 'center',
        marginBottom: 15,
    },

    percentageView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },

    timesStudiedText: {
        fontFamily: Fonts.serif,
        fontSize: 16,
    },

    percentText: {
        fontFamily: Fonts.serif,
        fontSize: 22,
        fontWeight: 'bold'
    },

    editDeleteView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
    },

    deleteCardButton: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '45%',
        backgroundColor: Colors.redText,
    },

    editCardButton: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '45%',
        backgroundColor: Colors.lightGrey,
    },

    editCardButtonText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 10
    },
})