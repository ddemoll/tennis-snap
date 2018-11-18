import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import { Button, Text as NBText } from 'native-base';
import { Colors } from "../Themes";

import * as RNIap from 'react-native-iap';
const skuMap = {
  'com.tennissnap.1pack': 1,
  'com.tennissnap.5pack': 5
}

class PurchaseContainer extends Component {

   buyItem = async(sku) => {
      this.props.onBuyNowPress();

      try {
        console.log('buyItem: ' + sku);
        const purchase = await RNIap.buyProduct(sku);

        await RNIap.consumePurchase(purchase.purchaseToken);
        console.log(purchase);

        let data = {
          ustaNum: this.props.ustaNum,
          count: skuMap[sku]
        }
        this.props.buyCaptainTeams(data);
        this.props.onComplete();

      } catch (err) {
        console.log(err);
      }
   }

   async componentDidMount() {
     //IN-APP-PURCHASE
     try {
       const result = await RNIap.prepare();
       const products = await RNIap.getProducts(Object.keys(skuMap));
       console.log('Products', products);
     }
     catch (err) {
       console.log(err.code, err.message);
     }
   }
   componentWillUnmount() {
     RNIap.endConnection();
   }

  render(){

    return (
      <View style={styles.middleContainer}>
        <View style={styles.header2Cntr}>
          <Text style={styles.h4}>Buy More Teams</Text>
        </View>

        <View style={styles.itemsCntr}>
          <View style={styles.itemContainer}>

              <View style={styles.txtCtnr}>
                <Text style={styles.titleTxt}>1 Team</Text>
                <Button rounded block success onPress={() => this.buyItem('com.tennissnap.1pack')}>
                  <NBText style={styles.btnText}>$9.99</NBText>
                </Button>
              </View>

          </View>
          <View style={styles.itemContainer}>

              <View style={styles.txtCtnr}>
                <Text style={styles.titleTxt}>5 Teams</Text>
                <Button rounded block success onPress={() => this.buyItem('com.tennissnap.5pack')}>
                  <NBText style={styles.btnText}>$37.99</NBText>
                </Button>
              </View>

          </View>
        </View>

      </View>

    )
  }
}
function mapStateToProps(state) {
  return {
    ustaNum: state.fetchedMatches.matches.userData.ustaNum,

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseContainer);
const styles = StyleSheet.create({
  middleContainer: {

      height: 180,
      borderRadius: 5,
      marginHorizontal: 20,
      //justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: Colors.appBlueLight
     //paddingHorizontal: 20,

   },
   header2Cntr: {
    paddingVertical: 10,
    borderBottomColor: Colors.steel,
    borderBottomWidth: StyleSheet.hairlineWidth,
   },
   itemsCntr: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   itemContainer: {
     flex: 1,
     flexDirection: 'row',
     //justifyContent: 'space-evenly',
     alignItems: 'center',
     paddingHorizontal: 10,


   },
   iconCntr: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   txtCtnr: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',

   },
   titleTxt: {
     fontSize: 20,
     color: 'white',
     fontWeight: 'bold',
     textAlign: 'center',
     paddingBottom: 2
   },
   subtitleTxt: {
     fontSize: 14,
     textAlign: 'center',
     color: Colors.steel,
     paddingTop: 2
   },
   h4: {
     fontSize: 26,
     color: 'white',
     textAlign: 'center'
   },
   btnText: {
     fontSize: 20,
     color: 'white',
   },
});
