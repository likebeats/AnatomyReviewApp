import React from 'react';
import {
  Text,
  View
} from 'react-native';

class TaggedCards extends React.Component {

  static navigationOptions = {
    title: 'Tagged Cards',
  };

  render() {
    return (
      <View>
        <Text>Tagged Cards</Text>
      </View>
    );
  }
}

export default TaggedCards;
