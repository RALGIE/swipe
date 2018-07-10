import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class Deck extends React.Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (event, gesture) => {
          // The most recent move distance is gesture.move{X,Y}

          // The accumulated gesture distance since becoming responder is
          // gesture.d{x,y}
          position.setValue({x:gesture.dx, y : gesture.dy});
        },
      onPanResponderRelease: (evt, gesture) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
          if (gesture.dx > SWIPE_THRESHOLD){
              this.forceSwipe("RIGHT");
          } else if (gesture.dx < -SWIPE_THRESHOLD){
              this.forceSwipe("LEFT");
          } else {
              this.resetPosition();
          }
        }
    });
    //this._position = position
    //this._panResponder = panResponder;
    this.state = { panResponder, position }
  }
  forceSwipe(direction){
    const x = direction === "RIGHT" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: {x, y:0},
      duration: SWIPE_OUT_DURATION
    }).start();
  }
  resetPosition(){
    Animated.spring(this.state.position, {
      toValue: {x:0, y:0}
    }).start();
  }
  getCardStyle(){
      const { position} = this.state;
      const rotate = position.x.interpolate({
          inputRange : [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
          outputRange : ['-120deg', '0deg','120deg']
      });
      return {
        ...position.getLayout(),
        transform: [ { rotate }]
      }
  }
  renderCards(){
     return this.props.data.map((item, index) => {
       if (index === 0){
           return (
             <Animated.View
             key={item.id}
             style={this.getCardStyle()}
              {...this.state.panResponder.panHandlers}
             >
             {this.props.renderCard(item)}
             </Animated.View>
           );
       }
       return this.props.renderCard(item);
     });
  }
  render(){
    return (

      //de 3 puntjes zet alle functies over naar de view
      <View>
         {this.renderCards()}
      </View>

  );}
}
