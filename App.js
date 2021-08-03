import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';
//import { createDrawerNavigator, DrawerView, DrawerItem } from '@react-navigation/drawer';

//Screens
import HomeScreen from './screens/HomeScreen';
import ViewSetScreen from './screens/ViewSetScreen';
import ViewCardScreen from './screens/ViewCardScreen';
import NewCardScreen from './screens/NewCardScreen';
import EditCardScreen from './screens/EditCardScreen';
import FlashCardScreen from './screens/FlashCardScreen';
//Styles
import Colors from './styles/Colors';

const Stack = createStackNavigator();
//const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <MenuProvider>
            <View style={styles.container}>
                <NavigationContainer>
                    <Stack.Navigator headerMode={"none"}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="ViewSet" component={ViewSetScreen} />
                        <Stack.Screen name="ViewCard" component={ViewCardScreen} />
                        <Stack.Screen name="NewCard" component={NewCardScreen} />
                        <Stack.Screen name="EditCard" component={EditCardScreen} />
                        <Stack.Screen name="FlashCard" component={FlashCardScreen} />
                    </Stack.Navigator>

                    {/*<Drawer.Navigator drawerPosition={'right'}>
                        <Drawer.Screen name="Home" component={HomeScreen} />
                        <Drawer.Screen name="ViewSet" component={ViewSetScreen} />
                        <Drawer.Screen name="ViewCard" component={ViewCardScreen} />
                        <Drawer.Screen name="NewCard" component={NewCardScreen} />
                    </Drawer.Navigator>*/}
                </NavigationContainer>
            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.notificationBar,
        paddingTop: 25
    },
});
