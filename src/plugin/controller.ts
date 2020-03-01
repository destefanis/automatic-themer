// Plugin window dimensions
figma.showUI(__html__, { width: 320, height: 358 });

// Imported themes
import { darkTheme } from "./dark-theme";

// Utility function for serializing nodes to pass back to the UI.
function serializeNodes(nodes) {
  let serializedNodes = JSON.stringify(nodes, [
    "name",
    "type",
    "children",
    "id"
  ]);

  return serializedNodes;
}

// Utility function for flattening the
// selection of nodes in Figma into an array.
const flatten = obj => {
  const array = Array.isArray(obj) ? obj : [obj];
  return array.reduce((acc, value) => {
    acc.push(value);
    if (value.children) {
      acc = acc.concat(flatten(value.children));
      delete value.children;
    }
    return acc;
  }, []);
};

figma.ui.onmessage = msg => {
  let skippedLayers = [];

  if (msg.type === "run-app") {
    // If nothing's selected, we tell the UI to keep the empty state.
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({
        type: "selection-updated",
        message: 0
      });
    } else {
      let selectedNodes = flatten(figma.currentPage.selection);

      // Update the UI with the number of selected nodes.
      // This will display our theming controls.
      figma.ui.postMessage({
        type: "selection-updated",
        message: serializeNodes(selectedNodes)
      });
    }
  }

  // When a theme is selected
  if (msg.type === "theme-update") {
    let nodesToTheme = flatten(figma.currentPage.selection);

    if (msg.message === "light-theme") {
      // Update the layers with this theme.
      nodesToTheme.map(selected => updateTheme(selected));
    }

    // Need to wait for some promises to resolve before
    // sending the skipped layers back to the UI.
    setTimeout(function() {
      figma.ui.postMessage({
        type: "layers-skipped",
        message: serializeNodes(skippedLayers)
      });
    }, 500);

    figma.notify(`Theming complete`, { timeout: 750 });
  }

  // When a layer is selected from the skipped layers.
  if (msg.type === "select-layer") {
    let layer = figma.getNodeById(msg.id);
    let layerArray = [];

    // Using selection and viewport requires an array.
    layerArray.push(layer);

    // Moves the layer into focus and selects so the user can update it.
    figma.notify(`Layer ${layer.name} selected`, { timeout: 750 });
    figma.currentPage.selection = layerArray;
    figma.viewport.scrollAndZoomIntoView(layerArray);
  }

  // Swap styles with the corresponding/mapped styles
  async function replaceStyles(
    node,
    style,
    mappings,
    applyStyle: (node, styleId) => void
  ) {
    // Find the style the ID corresponds to in the team library
    let importedStyle = await figma.importStyleByKeyAsync(style.key);

    // Once the promise is resolved, then see if the
    // key matches anything in the mappings object.
    if (mappings[importedStyle.key] !== undefined) {
      let mappingStyle = mappings[importedStyle.key];

      // Use the mapping value to fetch the official style.
      let newStyle = await figma.importStyleByKeyAsync(mappingStyle.mapsToKey);

      // Update the node with the new color.
      applyStyle(node, newStyle.id);
    } else {
      skippedLayers.push(node);
    }
  }

  async function replaceComponent(
    node,
    key,
    applyComponent: (node, masterComponent) => void
  ) {
    let importedComponent = await figma.importComponentByKeyAsync(key);
    // Update the node with the new color.
    applyComponent(node, importedComponent);
  }

  async function swapComponent(node, key) {
    await replaceComponent(
      node,
      key,
      (node, masterComponent) => (node.masterComponent = masterComponent)
    );
  }

  async function replaceFills(node, style, mappings) {
    await replaceStyles(
      node,
      style,
      mappings,
      (node, styleId) => (node.fillStyleId = styleId)
    );
  }

  async function replaceStrokes(node, style, mappings) {
    await replaceStyles(
      node,
      style,
      mappings,
      (node, styleId) => (node.strokeStyleId = styleId)
    );
  }

  async function replaceEffects(node, style, mappings) {
    await replaceStyles(
      node,
      style,
      mappings,
      (node, styleId) => (node.effectStyleId = styleId)
    );
  }

  // Locked layers + components to switch instances
  function updateTheme(node) {
    switch (node.type) {
      case "INSTANCE": {
        console.log(node);
        if (
          node.masterComponent.key ===
          "f0d4aa5e63fff4392e3b3c22884523369f5d0424"
        ) {
          swapComponent(node, "33425bd93c1b8cea071df9b5297f0b19583a643b");
        }
      }
      case "COMPONENT":
      case "RECTANGLE":
      case "ELLIPSE":
      case "POLYGON":
      case "STAR":
      case "LINE":
      case "BOOLEAN_OPERATION":
      case "FRAME":
      case "LINE":
      case "VECTOR": {
        if (node.fills) {
          if (node.fillStyleId && typeof node.fillStyleId !== "symbol") {
            let style = figma.getStyleById(node.fillStyleId);
            // Pass in the layer we want to change, the style ID the node is using.
            // and the set of mappings we want to check against.
            replaceFills(node, style, darkTheme);
          } else {
            skippedLayers.push(node);
          }
        }

        if (node.strokeStyleId) {
          replaceStrokes(
            node,
            figma.getStyleById(node.strokeStyleId),
            darkTheme
          );
        }

        if (node.effectStyleId) {
          replaceEffects(
            node,
            figma.getStyleById(node.effectStyleId),
            darkTheme
          );
        }

        break;
      }
      case "TEXT": {
        if (node.fillStyleId && typeof node.fillStyleId !== "symbol") {
          replaceFills(node, figma.getStyleById(node.fillStyleId), darkTheme);
        } else {
          skippedLayers.push(node);
        }
      }
      default: {
        // do nothing
      }
    }
  }
};
