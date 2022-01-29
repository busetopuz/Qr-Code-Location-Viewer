import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import QrScreen from "./src/screens/QrScreen";
import MapScreen from "./src/screens/MapScreen";
const navigator = createStackNavigator(
    {
        Qr: QrScreen,
        Map: MapScreen
    },
    {
        initialRouteName: "Qr",
        defaultNavigationOptions: {
            title: "Map App",
        },
    }
);

export default createAppContainer(navigator);