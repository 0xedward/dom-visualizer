/* eslint-disable require-jsdoc */
'use strict';

// eslint-disable-next-line no-unused-vars
function parseHTML(userInputString) {
  if (userInputString !== '') { // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString - adapt to different browsers - https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension
    const htmlDocument = parser.parseFromString(userInputString, 'text/html');
    let node = htmlDocument.documentElement;
    // Sample code to traverse first children until leaf
    let treeLevel = 0;
    while (node.childElementCount !== 0) {
      // Replace the line below with console.log(node) to see the object
      console.log(`Node on level ${treeLevel}: ${node.tagName}`);
      treeLevel++;
      node = node.children[0];
    }
    console.log(`Node on level ${treeLevel}: ${node.tagName}`);
  }
}
