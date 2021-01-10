/* eslint-disable require-jsdoc */
"use strict";

// eslint-disable-next-line no-unused-vars
function parseHTML(userInputString) {
  if (userInputString !== "") {
    // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString - adapt to different browsers - https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension
    const htmlDocument = parser.parseFromString(userInputString, "text/html");
    const node = htmlDocument.documentElement;

    const nodeListLevelOrder = levelOrderTraversal(node);
    const d3Dataset = d3DataFormatter(nodeListLevelOrder);
    return d3Dataset;
  }
}

function levelOrderTraversal(rootNode) {
  const array = [];
  search(rootNode, 1);

  function search(root, level) {
    if (root) {
      if (array.length < level) {
        array.push([]);
      }
      const arr = array[level - 1];
      arr.push(root.tagName);
      search(root.children[0], level + 1);
      search(root.children[1], level + 1);
    } else {
      return;
    }
  }
  return array;
}

// function d3DataFormatter(node) {
//   const rootObj = { name: node[0], children: [] };
//   const arr = [rootObj];
//   console.log(arr);
// }
