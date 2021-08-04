import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';
import CardInListButton from '../components/buttons/CardInListButton';
import ListOfCards from '../components/buttons/ListOfCards';
//Icons
import AddCardIcon from '../assets/icons/CirclePlusGold_icon.svg';
import ThreeDotMenuIcon from '../assets/icons/ThreeDotMenu_icon.svg';

/**
 * A screen that displays a list of all flashcards within a given set
 * Props must include the set's array index where it's stored in AsyncStorage, an object named "setData" that contains the set's name and the array of cards in the set
 * */
export default class ViewSetScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: []
        }
    }


    /**
     * Calling the LoadSet method when this page is loaded, and makes sure it's called again when focused by the navigation
     * */
    componentDidMount() {
        this.LoadSet();

        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.LoadSet();
            }
        );
    }


    /**
     * Calling LoadSet method when this page is navigated to so that it can update when cards are changed, added, or removed
     * */
    componentWillUnmount() {
        this.willFocusSubscription();
    }


    /**
     * Method called from componentWillMount and componentWillUnmount to make sure all of the cards displayed are up to date
     * */
    LoadSet = function () {
        AsyncStorageLibrary.RetrieveAllSets()
            .then(data => {
                this.setState(prevState => {
                    return ({
                        ...prevState,
                        cards: data.sets[this.props.route.params.setIndex].cards
                    });
                });
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("ViewStatScreen.LoadSet ERROR", error);
            })
    }


    /**
     * Method called from TouchableOpacity to go to the NewCardScreen and create a new card in this set
     * */
    CreateNewCard = function () {
        this.props.navigation.navigate("NewCard", {
            setIndex: this.props.route.params.setIndex,
            setName: this.props.route.params.setData.setName
        });
    }


    /**
     * Called from TouchableOpacity to load this set of flashcards and navigate to the FlashCardScreen
     * */
    PracticeSet = function () {
        this.props.navigation.navigate("FlashCard", { setData: this.props.route.params.setData });
    }


    /**
     * Creates a prompt to make sure the user really wants to delete this set
     * */
    PromptDeleteSet = function () {
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
                    onPress: () => this.DeleteSet()
                }
            ]
        );
    }


    /**
     * Called from a user prompt to delete this card from the set it belongs to
     * */
    DeleteSet = function () {
        AsyncStorageLibrary.DeleteSet(this.props.route.params.setIndex)
            .then(() => {
                this.props.navigation.goBack();
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("ViewSetScreen.DeleteSet ERROR", error);
            })
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header
                    navigation={this.props.navigation}
                    showBackButton={true}
                />

                <Menu style={styles.menuButton}>
                    <MenuTrigger>
                        <ThreeDotMenuIcon height={25} width={25} />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => this.PromptDeleteSet()} >
                            <Text style={styles.menuDeleteText}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>

                <Text style={styles.setNameText}>Cards in {this.props.route.params.setData.setName}</Text>

                {(this.state.cards.length == 0) && <Text style={styles.noCardsText}>There are no cards</Text>}

                <ListOfCards
                    cards={this.state.cards}
                    navigation={this.props.navigation}
                    setIndex={this.props.route.params.setIndex}
                />

                {/*<TouchableOpacity style={styles.newCardButton} onPress={() => this.CreateNewCard()}>
                    <Text style={styles.newCardButtonText}>New Card</Text>
                </TouchableOpacity>*/}
                <View style={styles.bottomRow}>
                    <TouchableOpacity style={styles.plusButton} onPress={() => this.CreateNewCard()}>
                        <AddCardIcon height={45} width={45} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newCardButton} disabled={this.state.cards.length == 0} onPress={() => this.PracticeSet()}>
                        <Text style={(this.state.cards.length == 0 ? styles.disabledText : styles.newCardButtonText)}>Practice</Text>
                    </TouchableOpacity>
                </View>
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

    menuDeleteText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.redText
    },

    noCardsText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 12,
        alignSelf: 'center',
        color: Colors.darkText,
        marginTop: 20,
    },

    setNameText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
    },

    bottomRow: {
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    newCardButton: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '45%',
        alignSelf: 'flex-end',
        marginBottom: 8,
        marginRight: 8,
        backgroundColor: Colors.redText,
    },

    newCardButtonText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 10,
        color: '#000'
    },

    disabledText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 10,
        color: Colors.disabledText
    },

    plusButton: {
        /*alignSelf: 'flex-end',
        marginRight: 15,
        marginBottom: 15,*/
    },
})