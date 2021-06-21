# EQKL

EQKL is a DOM visualizer designed for developers interested in seeing how their HTML renders onto the DOM Tree. Given any HTML, our DOM visualizer live updates the hierarchical relationship between different HTML tags along with their HTML type as specified by HTML Spec's [documentation](https://html.spec.whatwg.org/).

[Demo](https://0xedward.github.io/EQKL/)


# Development Setup
1. Clone the repository
2. Install dependencies 
```
cd EQKL && npm install
```
3. Start server with live reload
```
npm start
```

# Usage

1. [Add HTML to input](https://imgur.com/a/FfP9SDm) with optional Live Update.
2. Tree graph renders onto output.

![Figure 1-1](https://i.imgur.com/coOXwPj.png)


# Technologies and Dependencies
[D3.js](https://d3js.org/)
[Node.js](https://nodejs.org/en/)
[ESLint](https://eslint.org/)
[stylelint](https://stylelint.io/)
[Selenium](https://www.selenium.dev/)



# License
EQKL is free and open-source software licensed under the MIT License.

The MIT License (MIT)

Copyright (c) 2016-2020 Alexander Shelepenok

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
