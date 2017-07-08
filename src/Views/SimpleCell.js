import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

class SimpleCell extends React.Component {

  goToNextScreen() {
    console.log('goToNextScreen');
    console.log(this.props.rowData);
    this.props.navigation.navigate(this.props.rowData.screen, {cardData: this.props.rowData.data});
  }

  render() {
    return (
      <TouchableHighlight onPress={this.goToNextScreen.bind(this)} 
                      underlayColor={"#E8E8E8"}
                      style={styles.button}>
      <View style={styles.container}>
          <Text style={styles.text}>{this.props.rowData.text}</Text>
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
  }
});

export default SimpleCell;
