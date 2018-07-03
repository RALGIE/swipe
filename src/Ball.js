import React, { Component } from 'react';
import { View } from 'react-native';


export default class Ball extends Component {
  render() {
    return (
      <View style={styles.ball} />
    );
  }
}

const styles = {
   ball : {
     height:60,
     width:60,
     borderRadius : 30,
     borderWidth: 30,
     borderColor: 'red'
   }
};

// export default Ball;
