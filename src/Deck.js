import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';

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
      onPanResponderRelease: (evt, gestureState) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
        }
    });
    //this._position = position
    //this._panResponder = panResponder;
    this.state = { panResponder, position }
  }
  renderCards(){
     return this.props.data.map((item, index) => {
       if (index === 0){
           return (
             <Animated.View
             key={item.id}
             style={this.state.position.getLayout()}
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
