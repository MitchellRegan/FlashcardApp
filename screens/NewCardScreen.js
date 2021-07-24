import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Dimensions } from 'react-native';
//import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

//Styles
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';
import ErrorAlertLibrary from '../functions/ErrorAlertLibrary';
//Components
import Header from '../components/shared/Header';

//The most number of characters a question or answer can be
const MAXTEXTLENGTH = 256;
//The width of the screen
const SCREENWIDTH = Dimensions.get("window").width;

export default class NewCardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionText: '',
            questionImage: null,
            answerText: '',
            answerImage: null
        }
    }


    /**
     * Called from the onChangeText method of a TextInput field to update the questionText text in this.state
     * @param {string} question_ The string to save as the question for the card
     */
    UpdateQuestion = function (question_) {
        this.setState((prevState) => {
            return ({
                ...prevState,
                questionText: question_
            });
        });
    }


    /**
     * Called from the onChangeText method of a TextInput field to update the answerText text in this.state
     * @param {string} answer_ The string to save as the answer for the card
     */
    UpdateAnswer = function (answer_) {
        this.setState((prevState) => {
            return ({
                ...prevState,
                answerText: answer_
            });
        });
    }


    /**
     * Method called from TouchableOpacity to check if the user granted this app to use images
     * @param {boolean} isQuestionImage_ If True the image is set as the questionImage. If False the image is set as the answerImage
     * */
    GetPermissionsAsync = async function (isQuestionImage_ = true) {
        const response = await MediaLibrary.requestPermissionsAsync();

        if (response.status !== "granted") {
            Alert.alert('Sorry, but we need camera roll permissions in order to access images.');
        }
        else {
            this.PickImage(isQuestionImage_);
        }
    }


    /**
     * Method called from GetPermissionsAsync to let users pick an image from their device
     * @param {boolean} isQuestionImage_ If True the image is set as the questionImage. If False the image is set as the answerImage
     * */
    PickImage = async function (isQuestionImage_ = true) {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                aspect: [1,1],
                quality: 1,
                allowsEditing: true
            });

            if (!result.cancelled) {
                //Setting the questionImage in this.state
                if (isQuestionImage_) {
                    this.setState(prevState => {
                        return ({
                            ...prevState,
                            questionImage: result.uri
                        });
                    });
                }
                //Setting the answerImage in this.state
                else {
                    this.setState(prevState => {
                        return ({
                            ...prevState,
                            answerImage: result.uri
                        });
                    });
                }
            }
        }
        catch (error) {
            ErrorAlertLibrary.DisplayError("NewCardScreen.PickImage ERROR", error);
        }
    }


    /**
     * Method called from TouchableOpacity to clear the selected image
     * @param {boolean} isQuestionImage_ If True the image is set as the questionImage. If False the image is set as the answerImage
     * */
    ClearImage = function (isQuestionImage_ = true) {
        if (isQuestionImage_) {
            this.setState(prevState => {
                return ({
                    ...prevState,
                    questionImage: null
                });
            });
        }
        else {
            this.setState(prevState => {
                return ({
                    ...prevState,
                    answerImage: null
                });
            });
        }
    }


    /**
     * Function called from TouchableOpacity to create a new card using the data in this.state
     * @param {boolean} cancel_ If false, the card isn't created and the prompt is closed
     * */
    CreateNewCard = function (cancel_ = false) {
        if (cancel_) {
            this.props.navigation.goBack();
            return;
        }

        AsyncStorageLibrary.CreateNewCard(this.props.route.params.setIndex, this.state.questionText, this.state.answerText, this.state.questionImage, this.state.answerImage)
            .then(() => {
                this.props.navigation.goBack();
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("NewCardScreen.CreateNewCard ERROR", error);
            })
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <Header
                    navigation={this.props.navigation}
                    showBackButton={true}
                />

                <Text style={styles.titleText}>New Card</Text>
                <Text style={styles.subtitleText}>For {this.props.route.params.setName}</Text>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.inputView}>
                        <Text style={styles.inputTitleText}>Question<Text style={styles.requiredText}>*</Text></Text>

                        <TextInput
                            style={styles.textInput}
                            multiline={true}
                            maxLength={MAXTEXTLENGTH}
                            placeholder={"Example: 2 + 2"}
                            value={this.state.questionText}
                            onChangeText={(question_) => this.UpdateQuestion(question_)}
                        />

                        <Text style={styles.textLength}>{this.state.questionText.length} / {MAXTEXTLENGTH}</Text>
                    </View>

                    <View style={styles.imageView}>
                        <View style={styles.imageViewTextLine}>
                            <Text style={styles.inputTitleText}>Question Image</Text>

                            <TouchableOpacity style={styles.imageUploadButton} onPress={() => this.GetPermissionsAsync(true)}>
                                {(this.state.questionImage == null) && <Text style={styles.imageUploadText}>Upload Image</Text>}
                                {(this.state.questionImage != null) && <Text style={styles.imageUploadText}>Change Image</Text>}
                            </TouchableOpacity>
                        </View>

                        {(this.state.questionImage != null) && <Image source={{ uri: this.state.questionImage }} style={styles.image} />}

                        {(this.state.questionImage != null) && <TouchableOpacity style={styles.imageUploadButton} onPress={() => this.ClearImage(true)}>
                            <Text style={styles.imageUploadText}>Remove Image</Text>
                        </TouchableOpacity>}
                    </View>

                    <View style={styles.inputView}>
                        <Text style={styles.inputTitleText}>Answer<Text style={styles.requiredText}>*</Text></Text>

                        <TextInput
                            style={styles.textInput}
                            multiline={true}
                            maxLength={MAXTEXTLENGTH}
                            placeholder={"Example: 2 + 2 = 4"}
                            value={this.state.answerText}
                            onChangeText={(answer_) => this.UpdateAnswer(answer_)}
                        />

                        <Text style={styles.textLength}>{this.state.answerText.length} / {MAXTEXTLENGTH}</Text>
                    </View>

                    <View style={styles.imageView}>
                        <View style={styles.imageViewTextLine}>
                            <Text style={styles.inputTitleText}>Answer Image</Text>

                            <TouchableOpacity style={styles.imageUploadButton} onPress={() => this.GetPermissionsAsync(false)}>
                                {(this.state.answerImage == null) && <Text style={styles.imageUploadText}>Upload Image</Text>}
                                {(this.state.answerImage != null) && <Text style={styles.imageUploadText}>Change Image</Text>}
                            </TouchableOpacity>
                        </View>

                        {(this.state.answerImage != null) && <Image source={{ uri: this.state.answerImage }} style={styles.image} />}

                        {(this.state.answerImage != null) && <TouchableOpacity style={styles.imageUploadButton} onPress={() => this.ClearImage(false)}>
                            <Text style={styles.imageUploadText}>Remove Image</Text>
                        </TouchableOpacity>}
                    </View>

                    <Text style={styles.requiredText}>*Required</Text>
                </ScrollView>

                <View style={styles.promptButtonView}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => this.CreateNewCard(true)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <View style={styles.bar} />

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => this.CreateNewCard()}
                        disabled={(this.state.questionText == '' || this.state.answerText == '')}
                    >
                        {(this.state.questionText != '' && this.state.answerText != '') && <Text style={styles.createText}>Create</Text>}
                        {(this.state.questionText == '' || this.state.answerText == '') && <Text style={styles.disabledCreateText}>Create</Text>}
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

    subtitleText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
    },

    scrollView: {
        flex: 1
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
        paddingBottom: 2
    },

    textLength: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        alignSelf: 'flex-end'
    },

    imageView: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 15,
    },

    imageViewTextLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    image: {
        borderWidth: 1,
        borderColor: '#000',
        margin: 3,
        height: SCREENWIDTH - 80,
        width: SCREENWIDTH - 80,
        alignSelf: 'center',
    },

    imageUploadButton: {
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: Colors.lightGrey,
        alignSelf: 'center',
    },

    imageUploadText: {
        fontSize: 12,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
    },

    requiredText: {
        fontFamily: Fonts.serif,
        fontSize: 12,
        color: Colors.redText,
        alignSelf: 'center',
        marginTop: 15,
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