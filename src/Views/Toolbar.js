import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

class Toolbar extends React.Component {

  render() {

    var toolbarStyle = {
      backgroundColor: this.props.bgColor ? this.props.bgColor : 'rgba(245,245,245,1)',
    };

    return (
      <View ref="toolbar" style={[styles.wrapper, toolbarStyle]}>
        <View style={styles.columnWrap}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  wrapper: {
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    height: 43,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'grey',
  },

  green: {
    backgroundColor: 'green'
  },

  red: {
    backgroundColor: 'red'
  },

  columnWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  }

});

export default Toolbar;
