/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';

import {
  // AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-community/async-storage';

let client = {}

const App: () => React$Node = () => {
  const [statusText, setStatusText] = useState("disconnect")
  const [statusSubText, setStatusSubText] = useState("no subscribe")
  const [value, onChangeText] = useState('value')
  const [arrivedMessage, setArrivedMessage] = useState('No message')
  const [topic, setTopic] = useState('/World')
  
  const onMqttButtonPressed = () => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync : {
      }
    });
    
    function onConnect() {
      console.log("onConnect");
      setStatusText("onConnect");
    }
    
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        setStatusText("onConnectionLost:"+responseObject.errorMessage);
      }
    }
    
    function onMessageArrived(message) {
      console.log("onMessageArrived:"+message.payloadString);
      setArrivedMessage(message.payloadString);
    }
    
      console.warn("before client")
    
      client = new Paho.MQTT.Client('mqtt.devwarp.work', 443, 'enoki');
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;
      client.connect({ onSuccess:onConnect, useSSL: true, onFailure: (m) => console.log("failed", m) });
    }
    
    const onSendButtonPressed = () => {
        console.log("sending...");
        var message = new Paho.MQTT.Message(value);
        message.destinationName = topic;
        client.send(message);
      }
      
    const onSubscribeButtonPressed = () => {
      client.subscribe(topic)
      setStatusSubText('subscribe')
    }


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            <Text>Connection Status : {statusText}</Text>
            <Text>Subscribe Status : {statusSubText}</Text>
            <Button title="Connect to mqtt" onPress={onMqttButtonPressed}/>
            <Text>Topic Name</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => onChangeText(text)}
              value={topic}
            />
            <Text>Message</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => onChangeText(text)}
              value={value}
            />
            <Button title="Send Message" onPress={onSendButtonPressed} disabled={statusText !== "onConnect"}/>
            <View><Text>***</Text></View>
            <Button title="Subscribe" onPress={onSubscribeButtonPressed} disabled={statusText !== "onConnect"}/>
          <Text>{arrivedMessage}</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
