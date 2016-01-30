---
layout: post
author: Jim Hildensperger
title: Debugging with LLDB
tagline: It's awesome! You should use it
date: 2015-6-1
img: roundicons.png
---

https://developer.apple.com/library/mac/documentation/IDEs/Conceptual/gdb_to_lldb_transition_guide/document/lldb-command-examples.html

ps aux | grep Xcode | grep -v grep | awk '{print $2 " " $11}'

lldb /Applications/Xcode6-Beta6.app

breakpoint set --file  CDRSRunFocused.m --line 49

breakpoint set --file  OMColorHelper.m --line 53

thread info - ti
breakpoint - bp
continue - c
expression - expr
thread return - tr
thread backtrace - bt
frame select 1 - f1

breakpoint regex
- MethodName\\.

breakpoint command add - br co a 
p value 
continue
DONE

You must set seperate conditions and actions for objc and swift

Advanced Debugging with LLDB 2013
Debugging in Xcode 6
Advanced Swift Debugging in LLDB

expression works on the stack
REPL injects code into the running program

definition, documentation, xcode vs terminal, a real example. 

expr NSNumber *$zero = @0
thread return $zero 

vs 

2 debugger commands

https://developer.apple.com/library/mac/documentation/IDEs/Conceptual/gdb_to_lldb_transition_guide/document/lldb-terminal-workflow-tutorial.html
http://debugging-with-lldb.blogspot.com/2013/07/lldb-execution-commands.html
http://lldb.llvm.org/tutorial.html

---EVAL block with lldb -----
expr ((void (^)(id, NSError *))completionHandler)($l, nil)

part 1
- Setup
	- line br
		- Definition
		- Link to documentation
		- How I use it
	- exception br
	- symbolic br
	- thread info
	- frame select
	- Differences between command line and xcode

- Debugging
	- br with conditions
	- expr
	- thread return

- Example
	- Debugging a plugin (Pulling it all together, debugging without xcodes graphical interface to help you)
	- Include sample plugin

- References
	- WWDC video links
	- Other resources?


why console?
 - keeps a record of all the things
 - expression --object-description  --foo  *alias = po
 - e -0 -- foo
 - po foo
 - 2012 lldb talk creating custom aliases 
 * breakpoint set --selector drawRect: is class agnostic
 - use watch points when anything modifies an address (pointer)
 - thread until #line number 
 --xcode continue to here
 - p is an alias for expression
 - data formatters

 Custom descriptions with python
 413 Advanced Debugging with LLDB 2013 min 39
 expression struct $
