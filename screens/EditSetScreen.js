import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';

/**
 * Screen to allow the user to change a set's name, colors, and give the option to merge with another set
 * */
export default class EditSetScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setName: this.props.route.params.setName,
            setIndex: this.props.route.params.setIndex,
            setColor: this.props.route.params.setColor,
            setTextColor: this.props.route.params.setTextColor,
            setColorIndex: 0
        }
    }


    /**
     * Method called from TextInput to change the name of the set
     * @param {string} setName_ The new name to give the set
     */
    UpdateSetName(setName_) {
        this.setState(prevState => {
            return ({
                ...prevState,
                setName: setName_
            })
        });
    }


    /**
     * Method called from TouchableOpacity to update the changes to the set
     * @param {boolean} cancel_ Boolean for if we should save the data or cancel and leave the screen
     * */
    SaveChanges = function (cancel_ = false) {
        if (cancel_) {
            this.props.navigation.goBack();
        }
        else {
            AsyncStorageLibrary.EditSet(this.state.setIndex, this.state.setName, this.state.setColor, this.state.setTextColor)
                .then(() => {
                    this.props.navigation.goBack();
                })
                .catch(error => {
                    ErrorAlertLibrary.DisplayError("EditSetScreen.SaveChanges ERROR", error);
                })
        }
    }


    /**
     * Called from TouchableOpacity to set the background and text colors for the set
     * @param {number} colorIndex_
     * @param {string} backgroundColor_
     * @param {string} textColor_
     */
    UpdateNewSetColors = function (colorIndex_, backgroundColor_, textColor_) {
        this.setState(prevState => {
            return ({
                ...prevState,
                setColor: backgroundColor_,
                setTextColor: textColor_,
                setColorIndex: colorIndex_
            });
        });
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header navigation={this.props.navigation} showBackButton={true} />

                <Text style={styles.titleText}>Edit Set</Text>

                <View style={styles.inputView}>
                    <Text style={styles.inputTitleText}>Set Name<Text style={styles.requiredText}>*</Text></Text>

                    <TextInput
                        style={styles.textInput}
                        multiline={false}
                        maxLength={25}
                        placeholder={"Name"}
                        value={this.state.setName}
                        textAlign={'center'}
                        keyboardType={'default'}
                        onChangeText={(setName_) => this.UpdateSetName(setName_)}
                    />

                    <View style={{height: 20}}/>

                    <Text style={styles.inputTitleText}>Select the color for the set</Text>
                    <ScrollView
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                        style={styles.colorSelectScroll} horizontal={true}
                        showsHorizontalScrollIndicator={true}
                    >
                        {/*White and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 0 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setWhite, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(0, Colors.setWhite, Colors.blackText)}
                        />
                        {/*Black and white*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 1 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setBlack, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(1, Colors.setBlack, Colors.whiteText)}
                        />
                        {/*Red and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 2 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setRed, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(2, Colors.setRed, Colors.blackText)}
                        />
                        {/*Orange and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 3 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setOrange, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(3, Colors.setOrange, Colors.blackText)}
                        />
                        {/*Yellow and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 4 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setYellow, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(4, Colors.setYellow, Colors.blackText)}
                        />
                        {/*Green and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 5 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setGreen, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(5, Colors.setGreen, Colors.blackText)}
                        />
                        {/*Turquoise and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 6 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setTurquoise, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(6, Colors.setTurquoise, Colors.blackText)}
                        />
                        {/*Blue and white*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 7 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setBlue, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(7, Colors.setBlue, Colors.whiteText)}
                        />
                        {/*Purple and white*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 8 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setPurple, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(8, Colors.setPurple, Colors.whiteText)}
                        />
                        {/*Pink and black*/}
                        <TouchableOpacity
                            style={[this.state.setColorIndex == 9 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setPink, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(9, Colors.setPink, Colors.blackText)}
                        />
                    </ScrollView>
                </View>

                <Text style={styles.requiredText}>*Required</Text>

                <View style={{flex: 1}}/>

                <View style={styles.promptButtonView}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => this.SaveChanges(true)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <View style={styles.bar} />

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => this.SaveChanges()}
                        disabled={(this.state.setName == '')}
                    >
                        {(this.state.setName != '') && <Text style={styles.createText}>Save</Text>}
                        {(this.state.setName == '') && <Text style={styles.disabledCreateText}>Save</Text>}
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

    titleText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 24,
        alignSelf: 'center',
    },

    requiredText: {
        fontFamily: Fonts.serif,
        fontSize: 12,
        color: Colors.redText,
        alignSelf: 'center',
        marginTop: 15,
    },

    inputView: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 15,
    },

    inputTitleText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 16,
    },

    textInput: {
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
    },

    textLength: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        alignSelf: 'flex-end'
    },

    colorBoxButton: {
        height: 25,
        width: 25,
        borderRadius: 3,
        margin: 5,
        borderWidth: 1,
    },

    colorBoxButtonSelected: {
        height: 40,
        width: 40,
        borderRadius: 3,
        margin: 5,
        borderWidth: 1,
        alignSelf: 'center',
    },

    colorSelectScroll: {
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
    },

    promptButtonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#000',
    },

    cancelButton: {
        justifyContent: 'center',
    },

    cancelText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 15,
    },

    bar: {
        borderLeftWidth: 1,
        borderColor: '#000',
        height: '100%',
    },

    createButton: {
        justifyContent: 'center',
    },

    createText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 15,
    },

    disabledCreateText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 15,
        color: '#bbb'
    }
})