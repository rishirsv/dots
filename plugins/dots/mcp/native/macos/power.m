#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#include <stdio.h>
int main(void){@autoreleasepool{NSNotificationCenter*c=[[NSWorkspace sharedWorkspace] notificationCenter];[c addObserverForName:NSWorkspaceWillSleepNotification object:nil queue:nil usingBlock:^(NSNotification*n){puts("{\"type\":\"sleep\"}");fflush(stdout);}];[c addObserverForName:NSWorkspaceDidWakeNotification object:nil queue:nil usingBlock:^(NSNotification*n){puts("{\"type\":\"wake\"}");fflush(stdout);}];[[NSRunLoop currentRunLoop] run];}return 0;}
