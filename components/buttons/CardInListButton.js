import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Styles
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

/**
 * A button to be displayed in a flatlist on the ViewSetScreen component. Navigates to the ViewCardScreen when pressed.
 * Props: "setIndex" for the index of the set that this card is in, "cardIndex" for where this card is stored in the set, "cardData" for all the info stored in the card, and the "question" asked by the card
 * */
export default class CardInListButton extends Component {
    constructor(props) {
        super(props);
    }


    ViewCard = function () {
        this.props.navigation.navigate("ViewCard", {
            cardIndex: this.props.cardIndex,
            setIndex: this.props.setIndex
        });
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.cardButton} onPress={() => this.ViewCard()}>
                    <Text style={styles.questionText} numberOfLines={1}>{this.props.cardIndex + 1})  {this.props.question}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.secondaryDark,
        borderRadius: 10,
        borderColor: Colors.darkText,
        borderWidth: 1,
        marginBottom: 15,
    },

    cardButton: {

    },

    questionText: {
        color: Colors.lightText,
        fontFamily: Fonts.serif,
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
    },
})