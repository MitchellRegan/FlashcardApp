import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

//Icons
import BackArrowIcon from '../../assets/icons/BackArrow_icon.svg';
//Styles
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import App from '../../app.json';

/**
 * Displays the header at the top of the app and allows the use of a "Back" button
 * Props: "showBackButton" boolean. If true, a back button will be displayed on the top-left. If false, the button is hidden
 * */
export default class Header extends Component {
    constructor(props) {
        super(props);
    }


    /**
     * Displays a hidden alert with build info
     * */
    BuildDetails = function () {
        Alert.alert("HELLO!", "Developed by Mitch Regan\nJuly 4, 2021\nBuild: v" + App.expo.version);
    }


    render() {
        return (
            <View style={styles.wrapper}>
                {(this.props.showBackButton) && <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                    <BackArrowIcon width={30} height={30} />
                </TouchableOpacity>}
                {(!this.props.showBackButton) && <View style={{ width: 30 }} />}

                <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => this.BuildDetails()}>
                    <Text style={styles.headerText}>FLASHCARDS</Text>
                </TouchableOpacity>

                <View style={{ width: 30 }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: Colors.primary,
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
    },

    backButton: {
        alignSelf: 'center',
    },

    headerText: {
        alignSelf: 'center',
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 26,
    },

    drawerButton: {
        height: 40,
        width: 40,
        alignSelf: 'center',
    },
});