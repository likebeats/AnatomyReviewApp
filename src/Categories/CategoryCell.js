import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class CategoryCell extends React.Component {

  goToNextScreen() {
    this.props.navigation.navigate('CardDetails', {cardData: this.props.data});
  }

  render() {
    return (
      <TouchableHighlight onPress={this.goToNextScreen.bind(this)} 
                      underlayColor={"#E8E8E8"}
                      style={styles.button}>
      <View style={styles.container}>
          <Text style={styles.text}>{this.props.data.title}</Text>
      </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#bcbcbf'  
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default CategoryCell;
