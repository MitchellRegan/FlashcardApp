import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

//Styles
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

/**
 * A button to be displayed in a flatlist on the HomeScreen component. Navigates to the ViewSetScreen when pressed.
 * Props: "navigation" to be able to change screens, "setIndex" for the index of which set this is, and "setData" for the data contained in this set
 * */
export default class SetInListButton extends Component {
    constructor(props) {
        super(props);
    }


    /**
     * Converts the Date time to a smaller date format (day/month/year)
     * @param {string} setDate_ The Date when this set was created
     * @returns {string} The day/month/year format
     */
    ConvertDateToString = function (setDate_) {
        var d = new Date(setDate_);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();

        return (day + "/" + month + "/" + year);
    }


    /**
     * Called from TouchableOpacity to navigate to the ViewSetScreen and pass the set data
     * */
    ViewSet = function () {
        //console.log("View set " + this.props.setData.setName);
        this.props.navigation.navigate("ViewSet", { setData: this.props.setData, setIndex: this.props.setIndex });
    }


    render() {
        return (
            <View style={[styles.wrapper, this.props.setData.backgroundColor != null ? { backgroundColor: this.props.setData.backgroundColor } : { backgroundColor: Colors.tertiary }]}>
                <TouchableOpacity style={styles.setButton} onPress={() => this.ViewSet()}>
                    <Text
                        style={[styles.setName, this.props.setData.textColor != null ? { color: this.props.setData.textColor } : { color: '#fff' }]}>
                        {this.props.setData.setName}
                    </Text>
                    <View style={styles.countDateView}>
                        <Text
                            style={[styles.cardCount, this.props.setData.textColor != null ? { color: this.props.setData.textColor } : { color: '#fff' }]}>
                            Cards: {this.props.setData.cards.length}
                        </Text>
                        <Text
                            style={[styles.date, this.props.setData.textColor != null ? { color: this.props.setData.textColor } : { color: '#fff' }]}>
                            {this.ConvertDateToString(this.props.setData.dateCreated)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.tertiary,
        borderRadius: 10,
        borderColor: Colors.setBlack,
        borderWidth: 1,
        marginBottom: 15,
    },

    setButton: {

    },

    setName: {
        color: Colors.lightText,
        fontFamily: Fonts.serif,
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 5,
    },

    countDateView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    cardCount: {
        color: Colors.lightText,
        fontFamily: Fonts.serif,
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingBottom: 5,
    },

    date: {
        color: Colors.lightText,
        fontFamily: Fonts.serif,
        fontSize: 14,
        fontWeight: 'bold',
        paddingRight: 20,
        paddingBottom: 5,
    }
})