//
//  AMapSearch.h
//  Pods
//
//  Created by zero zhang on 2021/8/8.
//

#ifndef AMapSearch_h
#define AMapSearch_h
#import <React/RCTBridgeModule.h>

@interface AMapSearch : NSObject <RCTBridgeModule, AMapSearchDelegate>
@property (nonatomic, strong) AMapSearchAPI *amapSearch;
@property (nonatomic, strong) RCTResponseSenderBlock poiKeywordSearchCallback;
@end


#endif /* AMapSearch_h */
