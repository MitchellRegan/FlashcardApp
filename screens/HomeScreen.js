import React, {Component} from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';
import SetInListButton from '../components/buttons/SetInListButton';
import ListOfSets from '../components/buttons/ListOfSets';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showNewSetPrompt: false,
            newSetName: '',
            allSetData: {}
        }

        this.LoadSetData = this.LoadSetData.bind(this);
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
     * Function called from TouchableOpacity to create a new set of cards using the newSetName string in this.state
     * @param {boolean} cancel_ If false, the set isn't created and the prompt is closed
     * */
    CreateNewSet = function (cancel_ = false) {
        AsyncStorageLibrary.CreateNewSet(this.state.newSetName)
            .then(() => {
                this.LoadSetData();
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("HomeScreen.CreateNewSet ERROR", error);
            })

        /*this.setState((prevState) => {
            return ({
                ...prevState,
                showNewSetPrompt: false,
                newSetName: ""
            });
        });*/
    }


    /**
     * Method called when this component is initially loaded
     * */
    componentDidMount() {
        this.LoadSetData();
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header
                    navigation={this.props.navigation}
                    showBackButton={false}
                />

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

                    <View style={styles.promptButtonView}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => this.CreateNewSet(false)}>
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
        backgroundColor: Colors.lightGrey,
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
        backgroundColor: Colors.lightGrey
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