import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

//Components
import CardInListButton from './CardInListButton';

export default class ListOfCards extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <FlatList
                    style={styles.cardFlatlist}
                    persistentScrollbar={true}
                    keyExtractor={(itemData, index) => ("cardList" + index)}
                    data={this.props.cards}
                    renderItem={itemData => {
                        return (
                            <CardInListButton
                                navigation={this.props.navigation}
                                setIndex={this.props.route.params.setIndex}
                                cardIndex={itemData.index}
                                question={itemData.item.questionText}
                                cardData={itemData.item}
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

    },
});