import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

export default StatusIndicator = ({index}) => {

    if(index == "3") {
      return <Icon name="check-circle" size={32} color="green" />
    } else if(index == "2") {
      return <Icon name="question-circle" size={32} color="goldenrod" />
    } else if(index == "1") {
      return <Icon name="times-circle" size={32} color="red" />
    } else return null

}
