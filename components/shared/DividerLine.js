import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';

//Styles
import Colors from '../../styles/Colors';

export default class DividerLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            size: props.size
        }
    }


    GetStyle = () => {
        switch (this.state.size) {
            case 'normal':
                return styles.normal;
            case 'thin':
                return styles.thin;
            case 'bold':
                return styles.bold;
            default:
                return styles.normal;
        }
    }


    render() {
        return (
            <View style={ this.GetStyle() } />
        );
    }
}

const styles = StyleSheet.create({
    normal: {
        width: '100%',
        borderBottomColor: Colors.dividerColor,
        borderBottomWidth: 2,
        marginTop: 5,
        marginBottom: 5,
    },

    thin: {
        width: '100%',
        borderBottomColor: Colors.dividerColor,
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 5,
    },

    bold: {
        width: '100%',
        borderBottomColor: Colors.dividerColor,
        borderBottomWidth: 4,
        marginTop: 5,
        marginBottom: 5,
    },
});