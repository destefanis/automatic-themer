figma.showUI(__html__);

import { darkTheme } from "./dark-theme";

figma.ui.onmessage = msg => {
  if (msg.type === "run-app") {
    const nodes = [];
    console.log(msg.message);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: "theme-selected",
      message: `Dark Theme Applied`
    });

    // If nothing is selected update the whole page
    if (figma.currentPage.selection.length === 0) {
      const frameNodes = figma.currentPage.children;
      const allNodes = figma.currentPage.findAll();
      allNodes.map(selected => updateTheme(selected));
    } else if (figma.currentPage.selection.length === 1) {
      // Find all the nodes
      let allNodes = figma.currentPage.selection[0].findAll();
      allNodes.unshift(figma.currentPage.selection[0]);
      // Update the nodes
      allNodes.map(selected => updateTheme(selected));
    } else {
      let allNodes = [];
      let nodeLength = figma.currentPage.selection.length;

      // Find all the children nodes from the selected layers
      for (let i = 0; i < nodeLength; i++) {
        allNodes.push(figma.currentPage.selection[i].findAll());
      }

      allNodes.forEach(function(selectedNode) {
        selectedNode.map(selected => updateTheme(selected));
      });
    }
  }

  function updateTheme(node) {
    switch (node.type) {
      case "COMPONENT":
      case "INSTANCE":
      case "RECTANGLE":
      case "ELLIPSE":
      case "POLYGON":
      case "STAR":
      case "LINE":
      case "BOOLEAN_OPERATION":
      case "FRAME":
      case "VECTOR": {
        // Check to see if the node has a style
        if (node.fillStyleId) {
          // Fetch the style by using the ID.
          let style = figma.getStyleById(node.fillStyleId);
          // Pass in the layer we want to change, the style the node has
          // and the set of mappings we want to check against.
          replaceStyles(node, style, darkTheme);
        } else if (node.backgroundStyleId) {
          // Some elements have backgrounds instead of fills.
          let style = figma.getStyleById(node.backgroundStyleId);
          replaceBackground(node, style, darkTheme);
        }
        break;
      }
      case "TEXT": {
        if (node.fillStyleId) {
          let style = figma.getStyleById(node.fillStyleId);
          replaceStyles(node, style, darkTheme);
        }
      }
      default: {
        // do nothing
      }
    }
  }

  // Replaces fills with corresponding styles
  function replaceStyles(node, style, mappings) {
    // Find the style the ID corresponds to in the team library
    let importedStyle = figma.importStyleByKeyAsync(style.key);

    // Once the promise is resolved, then see if the
    // key matches anything in the mappings object.
    importedStyle.then(object => {
      // If it's null, no mapping exists yet.
      if (mappings[object.key] !== undefined) {
        let mappingStyle = mappings[object.key];

        // Use the mapping value to fetch the official style.
        let newStyle = figma.importStyleByKeyAsync(mappingStyle.mapsToKey);

        newStyle.then(function(object) {
          // Update the current style with the mapping.
          node.fillStyleId = object.id;
        });
      }
    });
  }

  // Updates backgrounds with styles @todo combine this function with replaceStyles
  function replaceBackground(node, style, mappings) {
    let importedStyle = figma.importStyleByKeyAsync(style.key);

    importedStyle.then(object => {
      if (mappings[object.key] !== undefined) {
        let mappingStyle = mappings[object.key];

        let newStyle = figma.importStyleByKeyAsync(mappingStyle.mapsToKey);

        newStyle.then(function(object) {
          node.backgroundStyleId = object.id;
        });
      }
    });
  }

  // figma.closePlugin();
};
