# DOM Visualizer
<p align=center>
  <img alt="DOM Visualizer sample output" src="https://user-images.githubusercontent.com/14011954/126092728-32be88a1-b0b9-4022-9f18-3c85195d325e.png"/><br>
</p>

[DOM Visualizer](https://0xedward.github.io/dom-visualizer/) was created for developers to view the DOM created by their browser for any HTML input. DOM Visualizer creates and displays the hierarchical relationship between different HTML tags.


# Supported Browsers
DOM Visualizer relies on the [DOMParser API](https://caniuse.com/xml-serializer) to parse HTML input strings. Currently most browsers are supported except for Opera Mini.

# Technologies and Dependencies
[D3.js](https://d3js.org/)

[Node.js](https://nodejs.org/en/)

[ESLint](https://eslint.org/)

[stylelint](https://stylelint.io/)

[Selenium](https://www.selenium.dev/)

# Development Setup
1. Clone the repository:
```
git clone https://github.com/0xedward/dom-visualizer.git
```
2. Install development dependencies
```
cd dom-visualizer && npm install
```
3. Start server with live reload
```
npm start
```