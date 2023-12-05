import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import UdpSocket from 'react-native-udp';
import { NetworkInfo } from 'react-native-network-info';
export default function App() {
    const [isServer, setIsServer] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('');
    const [socket, setSocket] = useState('');
    const [ipAddress, setIpAddress] = useState<string | null>('');
    const [mensaje, setMensaje] = useState('');
    const [ipServer, setIpServer] = React.useState('IP Server');
    useEffect(() => {
        const fetchIpAddress = async () => {
            const ip: string | null = await NetworkInfo.getIPV4Address();
            setIpAddress(ip);
        };

        fetchIpAddress();

        if (isServer) {
            // Configura la aplicación como servidor
            // @ts-ignore
            const server = UdpSocket.createSocket('udp4');

            server.on('message', (data, rinfo) => {
                setMensaje(data.toString());
                server.send(
                    '¡Hola desde el servidor!',
                    undefined,
                    undefined,
                    rinfo?.port,
                    rinfo?.address,
                    (error) => {
                        if (error) {
                            console.log('Error al enviar el mensaje:', error);
                        } else {
                            console.log('Mensaje enviado correctamente');
                        }
                    }
                );
                console.log('Mensaje recibido:', data.toString());
            });

            server.on('listening', () => {
                console.log(
                    'Servidor escuchando en el puerto:',
                    server.address().port
                );
                setConnectionStatus(
                    `Servidor escuchando en el puerto ${server.address().port}`
                );
            });

            server.bind(8888);
            // @ts-ignore
            setSocket(server);
        } else {
            setConnectionStatus(`Servidor desconectado`);
            // Configura la aplicación como cliente
            // @ts-ignore
            const client = UdpSocket.createSocket('udp4');
            client.bind(8887);
            // @ts-ignore
            setSocket(client);
        }

        return () => {
            // @ts-ignore
            socket && socket.close();
        };
    }, [isServer]);

    const sendMessage = () => {
        if (isServer) return;

        const client = socket;
        // @ts-ignore
        client.send(
            '¡Hola desde el cliente!',
            undefined,
            undefined,
            8888,
            ipServer,
            // @ts-ignore
            (error) => {
                if (error) {
                    console.log('Error al enviar el mensaje:', error);
                } else {
                    console.log('Mensaje enviado correctamente');
                }
            }
        );
        // @ts-ignore
        client.on('message', async (message, remoteInfo) => {
            setMensaje(message.toString());
        });
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>{connectionStatus}</Text>
            <Button
                title={isServer ? 'Detener Servidor' : 'Iniciar Servidor'}
                onPress={() => setIsServer(!isServer)}
            />
            <Button
                title='Enviar Mensaje'
                onPress={sendMessage}
                disabled={isServer}
            />
            <TextInput
                onChangeText={setIpServer}
                value={ipServer}
            />
            <Text>Dirección IP: {ipAddress}</Text>
            <Text>Mensaje recibído: {mensaje}</Text>
        </View>
    );
}
