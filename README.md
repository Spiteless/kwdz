# Kwdz Keyword Tracker

This application is built to be a lightweight serverless productivity tool to boost the preformance of content writers. Application state is preserved in the address bar making the app making easily shareable while also dodging the requirement of hanging onto any customer data.

Site is live at [kwdz.app](https://kwdz.app/)

## Core Technologies

 - Created with [Next.js](https://nextjs.org/)
 - Styled with [MUI](https://mui.com/)
 - Continuous deployment with [Netlify](https://www.netlify.com/)

## Usage

This application is intended to be used alongside a text editor such as [Google Docs](docs.new). Enter a list of keywords into the edge panel input separated by a line break "\n" to get started. Write your article and periodically paste the contexts into the article section to see which keywords you still need to hit.

Use the ```Copy missing to clipboard():``` command to get a list of the keywords that still need to be entered. This block of text can be safely pasted in the body of your article in your text editor, the application removes all text wrapped in {{double curly braces}}.

If your article needs to be a minimum length, you can use ```Set target:``` to add a word target, your word count updates each time the article is processed.

## Command bar:

Access the functions of this tool quickly and easily via the Command Bar. The command bar can be accessed by pressing Alt + /, and exposes the majority of the sites functionality at a few keystrokes.

```js
"Set target:" // sets the target wordcount -- number
"Set due date:" // sets the target wordcount -- string
"Set title:" // sets the title in AppBar -- string
"Set article:" // updates article text -- string
"Set keywords():" // toggles EdgePanel for keyword entry
"Copy missing to clipboard():" // Adds missing keywords to the clipboard surrounded by {{ curly braces }}
"View - unhide all keywords():" // sets hidden: false on all keywords
"Theme - toggle theme():" // rotates to next theme
"Theme - set theme():" // changes to theme by name or number
```

## Give it a try!

Suppose we're tasked with writing an SEO article about the history of JavaScript. We might get this list of key terms:

```
application programming interface
client
css
data structure
document object model
dynamic typing
ecmascript
eventdriven programming
firstclass function
functional programming
highlevel programming language
html
imperative programming
javascript
javascript engine
justintime compilation
library
objectoriented programming
programming language
programming paradigm
prototypebased programming
regular expression
source code
user
web browser
web page
website
world wide web
```

That list can be plugged into the Keyword Tracker, try it out and paste the keywords in from a [blank](https://kwdz.app/) slate or use the version with the [state preserved from the address bar](https://kwdz.app/?k0=eventdriven%20programming&k0=functional%20programming&k0=highlevel%20programming%20language&k0=justintime%20compilation&k0=library&k0=objectoriented%20programming&k0=prototypebased%20programming&k0=source%20code&k0=application%20programming%20interface&k0=client&k0=css&k0=data%20structure&k0=document%20object%20model&k0=dynamic%20typing&k0=ecmascript&k0=firstclass%20function&k0=html&k0=imperative%20programming&k0=javascript%20engine&k0=programming%20language&k0=regular%20expression&k0=user&k0=web%20browser&k0=web%20page&k0=website&k0=world%20wide%20web&k0=javascript&theme=dark&title=Wikipedia%20JavaScript).


As we compose our article, paste in the following sections to simulate creating an SEO post. As the article text changes the app will scan the text for keywords, and indicate their occurances in the lower below.

```
JavaScript, often abbreviated JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2022, 98% of websites use JavaScript on the client side for web page behavior, often incorporating third-party libraries. All major web browsers have a dedicated JavaScript engine to execute the code on users' devices.
```

```
JavaScript is a high-level, often just-in-time compiled language that conforms to the ECMAScript standard. It has dynamic typing, prototype-based object-orientation, and first-class functions. It is multi-paradigm, supporting event-driven, functional, and imperative programming styles. It has application programming interfaces  for working with text, dates, regular expressions, standard data structures, and the Document Object Model .
```
```
The ECMAScript standard does not include any input/output, such as networking, storage, or graphics facilities. In practice, the web browser or other runtime system provides JavaScript APIs for I/O.
```

Keywords that have been used are moved to the end of the stack, and highlighted green. When all the keywords are green, then you've fulfilled your obligation to the algorithmic overlords.

## Author

Trillium Smith - [trillium@hatsfabulous.com](mailto:trillium@hatsfabulous.com)

Fullstack Developer based on the West Coast
