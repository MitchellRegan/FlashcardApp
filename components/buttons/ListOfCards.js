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
                                setIndex={this.props.setIndex}
                                cardIndex={itemData.index}
                                question={itemData.item.cardName}
                                cardData={itemData.item}
                                setColor={this.props.backgroundColor}
                                setTextColor={this.props.textColor}
                                lastCard={itemData.index == this.props.cards.length - 1}
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

    cardFlatlist: {
        padding: 10,
        margin: 10,
    },
});