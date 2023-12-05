import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

export default function App() {
    const [myIp, setMyIp] = useState<string>('');

    useEffect(() => {
        NetworkInfo.getIPAddress().then((ipAddress: any) => {
            console.log(ipAddress);
            setMyIp(ipAddress);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text>My Ip Is : {myIp}</Text>
            <StatusBar style='auto' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
