import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Styles
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

/**
 * A button to be displayed in a flatlist on the ViewSetScreen component. Navigates to the ViewCardScreen when pressed.
 * Props: "setIndex" for the index of the set that this card is in, "cardIndex" for where this card is stored in the set, 
 * "cardData" for all the info stored in the card, "question" asked by the card, "setColor" for the background color of the
 * set, and "setTextColor" for the color of the set
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
            <View style={[this.props.lastCard ? styles.lastCardWrapper : styles.wrapper,
                this.props.setColor != null ? { backgroundColor: this.props.setColor } : {},
                this.props.setTextColor != null ? {borderColor: this.props.setTextColor} : {}
            ]}>
                <TouchableOpacity style={styles.cardButton} onPress={() => this.ViewCard()}>
                    <Text
                        style={[styles.questionText, this.props.setTextColor != null ? { color: this.props.setTextColor } : {}]}
                        numberOfLines={1}
                    >
                        {this.props.cardIndex + 1})  {this.props.question}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.secondaryDark,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderColor: Colors.setBlack,
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: -7,
    },

    lastCardWrapper: {
        backgroundColor: Colors.secondaryDark,
        borderRadius: 10,
        borderColor: Colors.setBlack,
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
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