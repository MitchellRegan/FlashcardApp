import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

//Components
import SetInListButton from './SetInListButton';

export default class ListOfSets extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <FlatList
                    style={styles.setFlatlist}
                    persistentScrollbar={true}
                    keyExtractor={(itemData, index) => ("setButton" + index)}
                    data={this.props.setData}
                    renderItem={itemData => {
                        return (
                            <SetInListButton
                                navigation={this.props.navigation}
                                setIndex={itemData.index}
                                setData={itemData.item}
                            />
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    setFlatlist: {
        padding: 10,
        margin: 10,
    },
});