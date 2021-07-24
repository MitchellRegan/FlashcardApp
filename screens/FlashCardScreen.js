import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';
import SwipeCards from '../components/swipeCards/SwipeCards';

/**
 * Screen where the user can practice studying the flashcards using the swipe card components
 * Props: "setData" containing all of the information for the set of flashcards to study
 * */
export default class FlashCardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header navigation={this.props.navigation} showBackButton={true} />

                <Text style={styles.headerText}>{this.props.route.params.setData.setName}</Text>

                <SwipeCards cards={this.props.route.params.setData.cards}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultScreenBackground
    },

    headerText: {
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Fonts.serif
    },
});