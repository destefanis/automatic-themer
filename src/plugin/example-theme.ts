// Themes are objects.
const sampleTheme = {
  // Within the object, we check for a *style key*,
  // Figma uses this key to refer to a specific style in your library
  "5c1691cbeaaf4270107d34f1a12f02fdd04afa02": {
    // Name isn't used, but is nice for reference.
    name: "Dark / Header / Primary (White)",
    // Within the object we check for the mapsToKey key value.
    // This is the style we'll swap the original style with.
    mapsToKey: "b19a14675b8adeb1528ab5f84e57b2eeed10d46c",
    mapsToName: "Light / Header / Primary (900)"
  }
};

// Don't know how to find a styles key? Use our inspector plugin
// https://www.figma.com/community/plugin/760351147138040099

export { sampleTheme };
