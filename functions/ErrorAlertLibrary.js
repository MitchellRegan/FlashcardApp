import { Alert } from 'react-native';

const ErrorAlertLibrary = {
    /**
     * Displays an error alert on the screen giving details about what the error was
     * @param {string} header_ The header for the error mesage. Should include the script name and the function call
     * @param {object} errorMsg_ The details of the error, usually from a try/catch output
     */
    DisplayError: function (header_, errorMsg_) {
        Alert.alert(
            header_,
            errorMsg_.message,
            [
                {
                    text: "Okay",
                    style: "cancel"
                }
            ]
        );
    }
}

export default ErrorAlertLibrary;