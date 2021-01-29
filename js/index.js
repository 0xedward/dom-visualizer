/* eslint-disable require-jsdoc */
"use strict";

function get(name) {
  if (
    (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
      location.search
    ))
  )
    return decodeURIComponent(name[1]);
}

function getUserParameter() {
  //window.location receives
  if (window.location.search !== "") {
    const userParameter = get(window.location.search);
    document.addEventListener("DOMContentLoaded", () => {
      generateDOMTree(userParameter);
    });
  }
}

getUserParameter();

function generateDOMTree(userInputString) {
  const parserOutputNode = parseHTML(userInputString);
  if (parserOutputNode !== null) {
    const d3TreeData = levelOrderTraversal(parserOutputNode);
    const DOMTreeRootNode = d3TreeData[0];
    createAndAppendDOMTree(DOMTreeRootNode);
  } else {
    // TODO remove this exception when we add try catch block to parseHTML
    throw new Error("DOMParser failed to parse user input string");
  }
}
// eslint-disable-next-line no-unused-vars
function parseHTML(userInputString) {
  if (userInputString !== "") {
    // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString - adapt to different browsers - https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension
    const htmlDocument = parser.parseFromString(userInputString, "text/html");
    return htmlDocument.documentElement;
  }
  return null;
}

function levelOrderTraversal(rootNode) {
  // Level order traverse the output of DOMParser
  const resultArray = [{ name: "HTML", children: [] }];
  levelOrderTraversalHelper(rootNode, resultArray[0].children, resultArray);
  return resultArray;
}

function levelOrderTraversalHelper(node, childrenArr, outputArray) {
  // TODO consider if it is worth removing the helper function
  // by not hardcoding [{name: 'HTML', children: []}] because
  // the conditional below is no longer intuitive
  if (
    node !== undefined &&
    node !== null &&
    outputArray !== undefined &&
    outputArray !== null
  ) {
    const isLeaf = node.children.length === 0;
    const isNotHTMLNode = node.parentNode.nodeName !== "#document";
    const currentNodeElementName = node.tagName;
    const currentNodeParentElementName = node.parentNode.tagName;
    if (isNotHTMLNode) {
      childrenArr.push({
        name: currentNodeElementName,
        parent: currentNodeParentElementName,
        children: [],
        obj: node,
      });
    } else if (isLeaf) {
      childrenArr.push({
        name: currentNodeElementName,
        // TODO do we need this reference?
        parent: currentNodeParentElementName,
        obj: node,
      });
    }
    if (!isLeaf) {
      for (let i = 0; i < node.children.length; i++) {
        if (isNotHTMLNode) {
          let currentNodeParentIndex = -1;
          for (let j = 0; j < childrenArr.length; j++) {
            if (childrenArr[j].obj === node) {
              currentNodeParentIndex = j;
              break;
            }
          }
          if (currentNodeParentIndex == -1) {
            throw new Error(
              "Algorithm failed to traverse in level order: Unable to find parent node of current node."
            );
          }
          levelOrderTraversalHelper(
            node.children[i],
            childrenArr[currentNodeParentIndex].children,
            outputArray
          );
        } else {
          // Currently on HTML node, we need to make a different call since the reference of childrenArr.children doesn't exist
          levelOrderTraversalHelper(node.children[i], childrenArr, outputArray);
        }
      }
    }
  } else {
    throw new Error(
      "Root node is undefined or reference to array to store the result does not exist."
    );
  }
}
