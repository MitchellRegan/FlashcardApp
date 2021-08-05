import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';
import ListOfSets from '../components/buttons/ListOfSets';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showNewSetPrompt: false,
            newSetName: '',
            newSetColor: '#fff',
            newSetTextColor: '#000',
            newSetColorIndex: 0,
            allSetData: {}
        }
    }


    /**
     * Called in the Render method to retrieve the list of saved sets when the page is first loaded
     * */
    LoadSetData = function () {
        AsyncStorageLibrary.RetrieveAllSets()
            .then(loadedSets => {
                //If there are no sets to load, nothing happens
                if (loadedSets == null) {
                    return;
                }

                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        allSetData: loadedSets.sets,
                        showNewSetPrompt: false,
                        newSetName: ""
                    });
                });
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("LoadSetData ERROR", error);
            })
    }


    /**
     * Called from TouchableOpacity to show the new set prompt area
     * */
    OpenNewSetPrompt = function () {
        this.setState((prevState) => {
            return ({
                ...prevState,
                showNewSetPrompt: true
            });
        });
    }


    /**
     * Called from the onChangeText method of a TextInput field to update the newSetName text in this.state
     * @param {string} setName_ The string to save as the name for the set that is being created
     */
    UpdateNewSetName = function (setName_) {
        this.setState((prevState) => {
            return ({
                ...prevState,
                newSetName: setName_
            });
        });
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
                newSetColor: backgroundColor_,
                newSetTextColor: textColor_,
                newSetColorIndex: colorIndex_
            });
        });
    }


    /**
     * Function called from TouchableOpacity to create a new set of cards using the newSetName string in this.state
     * @param {boolean} cancel_ If false, the set isn't created and the prompt is closed
     * */
    CreateNewSet = function (cancel_ = false) {
        if (cancel_) {
            this.setState(prevState => {
                return ({
                    ...prevState,
                    showNewSetPrompt: false,
                });
            });
            return;
        }
        else {
            AsyncStorageLibrary.CreateNewSet(this.state.newSetName, this.state.newSetColor, this.state.newSetTextColor)
                .then(() => {
                    this.LoadSetData();
                })
                .catch(error => {
                    ErrorAlertLibrary.DisplayError("HomeScreen.CreateNewSet ERROR", error);
                })
        }
    }


    /**
     * Method called when this component is initially loaded
     * */
    componentDidMount() {
        this.LoadSetData();

        this.reload = this.props.navigation.addListener('focus', () => {
            this.LoadSetData();
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
                <Header
                    navigation={this.props.navigation}
                    showBackButton={false}
                />

                <Text style={styles.titleText}>Flashcard Sets</Text>

                <ListOfSets setData={this.state.allSetData} navigation={this.props.navigation}/>

                {(!this.state.showNewSetPrompt) && <TouchableOpacity style={styles.newSetButton} onPress={() => this.OpenNewSetPrompt()}>
                    <Text style={styles.newSetButtonText}>New Set</Text>
                </TouchableOpacity>}

                {(this.state.showNewSetPrompt) && <View style={styles.promptView}>
                    <Text style={styles.promptText}>Enter the name for the new set</Text>
                    <TextInput
                        style={styles.promptInput}
                        keyboardType={"default"}
                        maxLength={25}
                        value={this.state.newSetName}
                        placeholder={"Name"}
                        textAlign={'center'}
                        autoFocus={true}
                        onChangeText={(setName_) => this.UpdateNewSetName(setName_)}
                    />

                    <Text style={styles.promptText}>Select the color for the set</Text>
                    <ScrollView
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                        style={styles.colorSelectScroll} horizontal={true}
                        showsHorizontalScrollIndicator={true}
                    >
                        {/*White and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 0 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setWhite, borderColor: Colors.blackText}]}
                            onPress={() => this.UpdateNewSetColors(0, Colors.setWhite, Colors.blackText)}
                        />
                        {/*Black and white*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 1 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setBlack, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(1, Colors.setBlack, Colors.whiteText)}
                        />
                        {/*Red and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 2 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setRed, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(2, Colors.setRed, Colors.blackText)}
                        />
                        {/*Orange and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 3 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setOrange, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(3, Colors.setOrange, Colors.blackText)}
                        />
                        {/*Yellow and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 4 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setYellow, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(4, Colors.setYellow, Colors.blackText)}
                        />
                        {/*Green and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 5 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setGreen, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(5, Colors.setGreen, Colors.blackText)}
                        />
                        {/*Turquoise and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 6 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setTurquoise, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(6, Colors.setTurquoise, Colors.blackText)}
                        />
                        {/*Blue and white*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 7 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setBlue, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(7, Colors.setBlue, Colors.whiteText)}
                        />
                        {/*Purple and white*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 8 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setPurple, borderColor: Colors.whiteText }]}
                            onPress={() => this.UpdateNewSetColors(8, Colors.setPurple, Colors.whiteText)}
                        />
                        {/*Pink and black*/}
                        <TouchableOpacity
                            style={[this.state.newSetColorIndex == 9 ? styles.colorBoxButtonSelected : styles.colorBoxButton, { backgroundColor: Colors.setPink, borderColor: Colors.blackText }]}
                            onPress={() => this.UpdateNewSetColors(9, Colors.setPink, Colors.blackText)}
                        />
                    </ScrollView>

                    <View style={styles.promptButtonView}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => this.CreateNewSet(true)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <View style={styles.bar} />

                        <TouchableOpacity style={styles.createButton} onPress={() => this.CreateNewSet()} disabled={(this.state.newSetName == '')}>
                            {(this.state.newSetName != '') && <Text style={styles.createText}>Create</Text>}
                            {(this.state.newSetName == '') && <Text style={styles.disabledCreateText}>Create</Text>}
                        </TouchableOpacity>
                    </View>
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultScreenBackground
    },

    titleText: {
        paddingTop: 20,
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 24,
        alignSelf: 'center',
    },

    setFlatlist: {
        padding: 10,
        margin: 10,
    },

    newSetButton: {
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

    newSetButtonText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 10
    },

    promptView: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff'
    },

    promptText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 6,
        alignSelf: 'center'
    },

    promptInput: {
        alignSelf: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        width: '70%',
        paddingLeft: 3,
        paddingRight: 3,
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
});