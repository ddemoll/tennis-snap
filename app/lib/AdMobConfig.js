import { Platform } from 'react-native'
import AppConfig from './AppConfig'

let osIndex = Platform.select({
  ios: 0,
  android: 1,
});

//[ios, android]
let bannerIDs = [
  ['ca-app-pub-8664538380753518/3752893398', 'ca-app-pub-8664538380753518/7855364908'],
  ['ca-app-pub-8664538380753518/4124412575', 'ca-app-pub-8664538380753518/7881508966'],
  ['ca-app-pub-8664538380753518/6503163908', 'ca-app-pub-8664538380753518/8348412820'],
  ['ca-app-pub-8664538380753518/8937755554', 'ca-app-pub-8664538380753518/3750692266'],
  ['ca-app-pub-8664538380753518/7405182033', 'ca-app-pub-8664538380753518/7736354525'],
];
let testID = 'ca-app-pub-3940256099942544/6300978111';

export default {

  //sizes: ["smartBannerPortrait", "mediumRectangle"],
  adCount: bannerIDs.length,

  getAdUnitID: (rowID) => {

    return AppConfig.useTestAds ? testID : bannerIDs[rowID%5][osIndex];
  }
}
