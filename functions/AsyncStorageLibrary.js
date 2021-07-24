import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorAlertLibrary from './ErrorAlertLibrary';


const AsyncStorageLibrary = {
    storageString: '@flashcards',

    /**
     * Returns an object containing all sets of flashcards
     * */
    RetrieveAllSets: async function () {
        let flashcardData = await AsyncStorage.getItem(this.storageString)
            .then(data => {
                return JSON.parse(data);
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.RetrieveAllSets ERROR", error);
            })

        return flashcardData;
    },


    /**
     * Creates a new, empty set of flashcards
     * @param {string} setName_ The string containing the name of the new set
     */
    CreateNewSet: async function (setName_) {
        var newSet = {
            setName: setName_,
            dateCreated: new Date(),
            cards: []
        }

        let setData = await AsyncStorage.getItem(this.storageString)
            .then(data => {
                //Parsing the JSON string into an object to get data from it
                var allSetData = JSON.parse(data);

                //If there's no set data already saved, we have to make the saved data
                if (allSetData == null) {
                    var newData = {
                        sets: [newSet]
                    };

                    AsyncStorage.setItem(this.storageString, JSON.stringify(newData));
                }
                //Otherwise we have to add the new company to the array
                else {
                    allSetData.sets.push(newSet);
                    AsyncStorage.setItem(this.storageString, JSON.stringify(allSetData));
                }
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.CreateNewSet ERROR", error);
            })
    },


    /**
     * Deletes the set from AsyncStorage using the given index
     * @param {number} setIndex_ Index for which set to delete
     */
    DeleteSet: async function (setIndex_) {
        let setData = await AsyncStorage.getItem(this.storageString)
            .then(data => {
                //Parsing the JSON string into an object to get data from it
                var allSetData = JSON.parse(data);
                //Deleting the specified set from our array of all sets
                allSetData.sets.splice(setIndex_, 1);
                //Saving the updated data
                AsyncStorage.setItem(this.storageString, JSON.stringify(allSetData));
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.DeleteSet ERROR", error);
            })
    },


    /**
     * Adds a new card to a set of flashcards
     * @param {number} setIndex_ Index for which set this card belongs to
     * @param {string} question_ Text containing the question to ask the user
     * @param {string} answer_ Text containing the answer to the question
     * @param {string} questionImage_ The file path for the image used to accompany the question
     * @param {string} answerImage_ The file path for the image used to accompany the answer
     */
    CreateNewCard: async function (setIndex_, question_, answer_, questionImage_ = null, answerImage_ = null) {
        var newCard = {
            questionText: question_,
            questionImage: questionImage_,
            answerText: answer_,
            answerImage: answerImage_,
            correct: 0,
            incorrect: 0
        }

        let setData = await AsyncStorage.getItem(this.storageString)
            .then(data => {
                //Parsing the JSON string into an object to get data from it
                var allSetData = JSON.parse(data);
                //Adding the newly created card to the designated set index
                allSetData.sets[setIndex_].cards.push(newCard);
                //Saving the updated data
                AsyncStorage.setItem(this.storageString, JSON.stringify(allSetData));
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.CreateNewCard ERROR", error);
            })
    },


    /**
     * Deletes a card from a set of flashcards
     * @param {number} setIndex_ Index for which set the deleted card belongs to
     * @param {number} cardIndex_ Index for which card to remove from the set
     */
    DeleteCard: async function (setIndex_, cardIndex_) {
        let setData = await AsyncStorage.getItem(this.storageString)
            .then(data => {
                //Parsing the JSON string into an object to get data from it
                var allSetData = JSON.parse(data);
                //Deleting the specific card from the given set
                allSetData.sets[setIndex_].cards.splice(cardIndex_, 1);
                //Saving the updated data
                AsyncStorage.setItem(this.storageString, JSON.stringify(allSetData));
            })
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.DeleteCard ERROR", error);
            })
    },


    /**
     * WARNING: This function deletes ALL data for this app and should only be used as a debug tool for testing
     * */
    DeleteAllData: function () {
        AsyncStorage.removeItem(this.storageString)
            .catch(error => {
                ErrorAlertLibrary.DisplayError("AsyncStorageLibrary.DeleteAllData", error);
            })
    }
}

export default AsyncStorageLibrary;