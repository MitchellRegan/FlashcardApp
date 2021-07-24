import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class DEFAULTCOMPONENT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            var1: "blah"
        }
    }

    componentDidMount() {
        //This is called when the component first loads
    }

    TestMethod = function () {

    }



    render() {
        return (
            <View style={styles.wrapper}>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
    }
});