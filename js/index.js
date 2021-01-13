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

      for (let i = 0; i < root.children.length; i++) {
        search(root.children[i], level + 1);
      }
    } else {
      return;
    }
  }
  return array;
}

function d3DataFormatter(nodeList) {
  const formattedData = [];
  //Every object should have a childrens property unless we're on the last nested array within 2d array
  //Every object should have a parent's property unless we're on the first nested array within 2d array
  for (let i = 0; i < nodeList.length; i++) {
    const levelNodes = nodeList[i];
    for (let j = 0; j < levelNodes.length; j++) {
      console.log(levelNodes);
      let tagName = levelNodes[i];
      formattedData[i] = { name: tagName };
    }
  }
  console.log(formattedData);
  return formattedData;
}
