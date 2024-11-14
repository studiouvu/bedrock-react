#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"BedrockApp"
                                            initialProperties:nil];

  rootView.backgroundColor = [UIColor colorWithRed:(15.0/255.0) green:(15.0/255.0) blue:(15.0/255.0) alpha:1.0];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
  NSURL *releaseURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  NSLog(@"RELEASE bundle URL: %@", releaseURL);
  return releaseURL;
}

@end
