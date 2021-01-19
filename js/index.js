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
    console.log(nodeListLevelOrder);
  }
}

function levelOrderTraversal(rootNode) {
  const array = [];
  search(rootNode, 1);

  function search(root, level) {
    if (root !== undefined) {
      if (array.length < level) {
        array.push([]);
      }
      const arr = array[level - 1];
      arr.push({ name: root.tagName });

      if (level === 1) {
      }

      if (root.children !== undefined) {
        arr[arr.length - 1].children = [];
      }

      for (let i = 0; i < root.children.length; i++) {
        search(root.children[i], level + 1);
      }
    } else {
      return;
    }
  }
  return array;
}

// function JSONConverter(rootNode) {
//   //rootNode is HTML tag
//   const array = [];

//   //rootNode = <script>

//   if (rootNode.children === undefined) {
//     let arr
//     while(array.children !== undefined){
//       let arr = array.children
//     }

//     array[array.length - 1]children.push({
//       name: rootNode.tagName,
//       parent: array[array.length - 1].tagName,
//     });
//   }

//   if (rootNode.children !== undefined) {
//     array.push({ name: rootNode.tagName, children: [] });

//     for (let i = 0; i < rootNode.children.length; i++) {
//       array[array.length - 1].children.push({
//         name: rootNode.children[i].tagName,
//         parent: rootNode.tagName,
//         children: [],
//       });

//       JSONConverter(rootNode.children[i]);
//     }
//   }

//   return array;
// }
