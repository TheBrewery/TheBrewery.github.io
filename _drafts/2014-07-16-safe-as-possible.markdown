---
layout: post
author: Jim Hildensperger
title: Literally As Safe As Possible
date: 2015-3-1 00:00:00 -0800
img: roundicons.png
---

**The Problem**
Objective-C objects have a lifecycle that you are not always in control of. Objective-C also allows for your to message or have nil pointers. It is quite easy to put almost put nil where when can never go into the NSDictionary (or NSArray).

**The Solution**
I have 4 different solutions to the problem of nil in a NSDictionary. All of them have pros and cons as well as opportunities for optimization. The examples will all run and work for most use cases, but there are many (potentially better) implementations out there. 

##Iteration 1
Create a mutable dictionary and check each value before insertion.

    NSMutableDictionary *mutableDictionary = [NSMutableDictionary dictionary];
    if (value1) {
    	mutableDictionary[@"key1"] = value1;
    }
    if (value2) {
    	mutableDictionary[@"key2"] = value2;
    }
    

**pros**
- clear visibilty 
**cons**
- long winded

##Iteration 2

Create a category on NSMutableDictionary to safely set values for keys.

    @interface NSMutableDictionary (safe)
       
     - (void)my_setObjectIfNotNil:(id)object forKey:(id)key;
        
    @end
	
	@implementation NSMutableDictionary (safe)
	
	- (void)my_setObjectIfNotNil:(id)value forKey:(id<NSCopying>)key {
		if (value) {
			[self setObject:object forKey:key];
		}
	}
	
	@end

now we have something that looks like this

`NSMutableDictionary *mutableDictionary = [NSMutableDictionary dictionary];
[mutableDictionary my_setObjectIfNotNil:value1 forKey:@"key1"];
[mutableDictionary my_setObjectIfNotNil:value2 forKey:@"key2"];`

**pros**
- things
**cons**
-things

##Iteration 3
macro for valueOrNSNull
literal dictionary using macro
method on dictionary to remove nsnull or leave it

##Iteration 4

Create a category on NSDictionary to make a dictionary of objects and key by filtering out nil.

    @interface NSDictionary (safe)
    
    + (instancetype)my_dictionaryWithCount:(NSUInteger)count unsafeObjectsAndKeys:(id)firstObject, ... NS_REQUIRES_NIL_TERMINATION;
    
    @end
    
    @implementation NSDictionary (safe)
    
    + (instancetype)my_dictionaryWithCount:(NSUInteger)count unsafeObjectsAndKeys:(id)firstObject, ... {
        NSMutableArray *nonNilObjects = [NSMutableArray array];
        NSMutableArray *nonNilKeys = [NSMutableArray array];
        
        int i = 0;
        id object;
    
        va_list args;
        va_start(args, firstObject);
        for (id arg = firstObject; i < count; arg = va_arg(args, id)) {
            if (i%2) {
                if (object && arg) {
                    [nonNilKeys addObject:arg];
                    [nonNilObjects addObject:object];
                } else {
                    NSLog(@"There was an issue adding object : %@ for key : %@", object, arg);
                }
            } else {
                object = arg;
            }
            i++;
        }
        va_end(args);
        
        return [NSDictionary dictionaryWithObjects:nonNilObjects forKeys:nonNilKeys];
    }
    @end

This isn't exactly pretty yet, but is finally a one-liner

    NSDictionary *safeDictionary = [NSDictionary my_dictionaryWithCount:4 unsafeObjectsAndKeys:value1, @"key1", value2, @"key2", nil];

**pros**

 - concise

**cons**

 - Not exactly pretty
 - Does not allow for literal dictionaries

##Iteration 5

Create a category on NSDictionary that swizzles out `+[NSDictionary dictionaryWithObjects:forKeys:count:]`. [From the LLVM discussion on Objective-C literals](http://clang.llvm.org/docs/ObjectiveCLiterals.html#id2) we can see that this is the method called when creating an Objective-C literal dictionary.

    @interface NSDictionary (safe)
    
    @end
    
    @implementation NSDictionary (safe)
    
    + (void)initialize {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
	        Class c = [self class];
	        SEL originalSelector = @selector(dictionaryWithObjects:forKeys:count:);
	        SEL newSelector = @selector(my_nilSafeDictionaryWithObjects:forKeys:count:);
            Method originalMethod = class_getClassMethod(c, originalSelector);
	        Method newMethod = class_getClassMethod(c, newSelector);
            method_exchangeImplementations(originalMethod, newMethod);
    }
    
    + (instancetype)my_nilSafeDictionaryWithObjects:(const id [])objects forKeys:(const id <NSCopying> [])keys count:(NSUInteger)cnt {
		NSMutableDictionary *mutableDictionary;
        for (int i = 0; i<cnt; i++) {
            id object = objects[i];
            id key = keys[i];
            if (object && key) {
                if (!mutableDictionary) {
                    mutableDictionary = [NSMutableDictionary dictionaryWithCapacity:cnt];
                }
                mutableDictionary[key] = object;
            } else {
                NSLog(@"There was an issue adding object : %@ for key : %@", object, key);
            }
        }
        return [mutableDictionary copy];
    } 
    
    @end

Now we have something that looks like a plain and simple literal dictionary, but is literally safe as can be `:)`

    NSDictionary *literallySafeDictionary = @{@"key1" : value1, @"key2" : value2};

It is worth noting doing this may cause cost a little performance in exchange for more safety. I would highly suggest using logging and `[[NSThread callStackSymbols] objectAtIndex:1]` to log the method where the formerly unsafe literal was declared. That should make it easier to track down issues if the removed values and keys do more harm than good.

**pros**

 - Works for all instances of literal dictionary

**cons**

 - Potential performance hit from NSMutableDictionary allocation
