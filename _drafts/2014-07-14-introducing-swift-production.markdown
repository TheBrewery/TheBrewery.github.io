---
layout: post
author: Jim Hildensperger
title: Introducing Swift to a Production Environment
date: 2015-5-1 00:00:00 -0800
img: roundicons.png
---

When apple first announced Swfit at WWDC I was very interested and somewhat terrified. Thinking of the gotchas and intricacies of objective-c learning a new language that had yet to hit v1.0 seemed pretty daunting. Also like most people working with existing code bases I  don't have the luxury of rewriting everything in Swift. So I started to make a plan to begin shipping production Swift code at TaskRabbit after some inspiring talks at NSSpain and time to tinker during the trip from SF.

###TaskRabbit and TDD
TaskRabbit’s iOS projects have been TDD from the beginning. Version 1.0 shipped with an extensive Cedar test suite and was migrated during v2.0 to Kiwi. Our shared code library, Version 3.0 in the app store, and our enterprise Tasker app have all been built using TDD and Kiwi. Introducing Swift to a TDD project and not sacrificing the principles of testing has been quite an interesting undertaking. See our other articles about testing with Kiwi (add links)

###Exposing Objective-C To Swift
When adding your first Swift source file to an objective-c project, Xcode will ask  if you would like it generate a bridging header. It will create this file in the format `{project name}-Bridging-Header.h` and is linked to your app target as the Objective-C Bridging Header the Build Settings. You can also create this file yourself, name it whatever you like, and configure the build settings yourself. The purpose of the bridging header is to make objective-c classes available in your swift code. You may need to import lots of headers so I would recommend formatting your bridging header like this:
    
    #pragma mark - Section Title
    
    #import “header1.h”
    #import “header2.h”

###Exposing Swift To Objective-C
The Swift compiler automatically generates a header for the public classes and methods of the Swift classes you create. In objective-c classes where you would like to interface with Swift classes you can import this header named `{project name}-Swift.h`. You can also import this file in your `.pch` if you use one for your project.

This compiler generated file is nice and relatively easy to use, but we had one major issue with it. The tricky thing is this file is generated for the target that contains the Swift source. With a Kiwi test target the app target is a dependency of the specs target so the specs target will not be able to see the header in app’s derived sources. You’ll need to add 
 
 `$(PROJECT_TEMP_DIR)/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)/${PROJECT_NAME}.build/DerivedSources/`

to the User Header Search Paths of your build settings for your specs target. Then you can simply import `{project name}-Swift.h` in the spec files or your specs precompiled header if you use one.

###Wrapping up
This is definitely still a work in progress. I have tried many tactics to accomplish the things needed to use Swift with in a full-scale test-driven Objective-C project and this is what has worked for us thus far. We are just getting started, but key features developed in Swift are soon to be released. I would gladly accept questions, comments, or suggestions of how others and integrating Swift into their existing workflow.