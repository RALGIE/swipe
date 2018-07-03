import React, { Component } from 'react';
import { View, Animated, Button } from 'react-native';


export default class Ball extends React.Component {
  componentWillMount(){
     this.position = new Animated.ValueXY(0,0);
     // Animated.spring(this.position, {
     //   toValue: {x:200, y:500}
     // }).start();
  }
  render() {
    return ([
      <Animated.View style={this.position.getLayout()}>
          <View style={styles.ball} />
      </Animated.View>,
      <View style={styles.button} >
          <Button onPress={
            () => {
              Animated.sequence([
            Animated.spring(this.position, {
              toValue: {x:200, y:500}
            }),
            Animated.spring(this.position, {
              toValue: {x:0, y:0}
            })
            ]).start();

          }} title="Press Me" />
      </View>
      ]);
  }
}

const styles = {
   ball : {
     position: 'relative',
     height:60,
     width:60,
     borderRadius : 30,
     borderWidth: 30,
     borderColor: 'red',
      zIndex:10
   },
   button: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   }
};
