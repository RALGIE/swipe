import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class Deck extends React.Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft : () => {}
  }
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
    this.state = { panResponder, position, index : 0  }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.data !== this.props.data ) {
      this.setState({index :0}); 
    }
  }

  componentWillUpdate(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();  
  }

  forceSwipe(direction){
    const x = direction === "RIGHT" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: {x, y:0},
      duration: SWIPE_OUT_DURATION
    }).start(()=> this.onSwipeComplete(direction));
  }
  onSwipeComplete(direction){
     const {onSwipeLeft, onSwipeRight, data } = this.props;
     const item = data[this.state.index]
     direction === "RIGHT" ? onSwipeLeft(item) : onSwipeRight(item);
     this.state.position.setValue({x : 0, y : 0});
     this.setState({index: this.state.index + 1});
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
     if (this.state.index >= this.props.data.length){
       return this.props.renderNoMoreCards();
     }

     return this.props.data.map((item, mapIndex) => {
       console.log("mapindex=" + mapIndex);
       console.log("this.state.index=" + this.state.index);
       console.log("item=",item);
       if (mapIndex < this.state.index){
         return null;
       }
       if (mapIndex == this.state.index){
           console.log("render card with id " + item.id);
           return (
             <Animated.View
             key={item.id}
             style={[this.getCardStyle(), styles.cardstyle]}
              {...this.state.panResponder.panHandlers}
             >
             {this.props.renderCard(item)}
             </Animated.View>
           );
       }
       return (
         <Animated.View 
           key={item.id} 
           style={[styles.cardstyle, {top : 10 * (mapIndex - this.state.index)}]}>
           {this.props.renderCard(item)}
         </Animated.View>
       );
     }).reverse();
  }
  render(){
    return (
      <View>
         {this.renderCards()}
      </View>
  );}
}

const styles = StyleSheet.create({
  cardstyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  },
});
