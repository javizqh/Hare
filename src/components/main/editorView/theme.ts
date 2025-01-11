import {EditorView} from "@codemirror/view"
import {Extension} from "@codemirror/state"
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags as t} from "@lezer/highlight"

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

// const chalky = "#e5c07b",
//   coral = "#e06c75",
//   cyan = "#56b6c2",
//   invalid = "#ffffff",
//   ivory = "#abb2bf",
//   accent = "var(--dragbar-color)", // Brightened compared to original to increase contrast
//   sage = "#98c379",
//   whiskey = "#d19a66",
//   darkBackground = "#21252b",
//   highlightBackground = "#2c313a",
//   background = "var(--background)",
//   tooltipBackground = "#353a42",
//   selection = "#3E4451",
//   cursor = "#528bff",
//   blue = "#569cd6"

// /// The colors used in the theme, as CSS color strings.
// export const color = {
//   chalky,
//   coral,
//   cyan,
//   invalid,
//   ivory,
//   accent,
//   sage,
//   whiskey,
//   darkBackground,
//   highlightBackground,
//   background,
//   tooltipBackground,
//   selection,
//   cursor,
//   blue
// }

// /// The editor theme styles for One Dark.
// export const myTheme = EditorView.theme({
//   "&": {
//     color: ivory,
//     backgroundColor: background
//   },

//   ".cm-content": {
//     caretColor: cursor
//   },

//   ".cm-cursor, .cm-dropCursor": {borderLeftColor: cursor},
//   "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {backgroundColor: selection},

//   ".cm-panels": {backgroundColor: darkBackground, color: ivory},
//   ".cm-panels.cm-panels-top": {borderBottom: "2px solid black"},
//   ".cm-panels.cm-panels-bottom": {borderTop: "2px solid black"},

//   ".cm-searchMatch": {
//     backgroundColor: "#72a1ff59",
//     outline: "1px solid #457dff"
//   },
//   ".cm-searchMatch.cm-searchMatch-selected": {
//     backgroundColor: "#6199ff2f"
//   },

//   ".cm-activeLine": {backgroundColor: "#6699ff0b"},
//   ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

//   "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
//     backgroundColor: "#bad0f847"
//   },

//   ".cm-gutters": {
//     backgroundColor: background,
//     color: accent,
//     border: "none"
//   },

//   ".cm-activeLineGutter": {
//     backgroundColor: highlightBackground
//   },

//   ".cm-foldPlaceholder": {
//     backgroundColor: "transparent",
//     border: "none",
//     color: "#ddd"
//   },

//   ".cm-tooltip": {
//     border: "none",
//     backgroundColor: tooltipBackground
//   },
//   ".cm-tooltip .cm-tooltip-arrow:before": {
//     borderTopColor: "transparent",
//     borderBottomColor: "transparent"
//   },
//   ".cm-tooltip .cm-tooltip-arrow:after": {
//     borderTopColor: tooltipBackground,
//     borderBottomColor: tooltipBackground
//   },
//   ".cm-tooltip-autocomplete": {
//     "& > ul > li[aria-selected]": {
//       backgroundColor: highlightBackground,
//       color: ivory
//     }
//   }
// }, {dark: true})

// /// The highlighting style for code in the One Dark theme.
// export const myHighlightStyle = HighlightStyle.define([
//   {tag: t.keyword,
//    color: blue},
//   {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
//    color: coral},
//   {tag: [t.function(t.variableName), t.labelName],
//    color: blue},
//   {tag: [t.color, t.constant(t.name), t.standard(t.name)],
//    color: whiskey},
//   {tag: [t.definition(t.name), t.separator],
//    color: ivory},
//   {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
//    color: chalky},
//   {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
//    color: cyan},
//   {tag: [t.meta, t.comment],
//    color: accent},
//   {tag: t.strong,
//    fontWeight: "bold"},
//   {tag: t.emphasis,
//    fontStyle: "italic"},
//   {tag: t.strikethrough,
//    textDecoration: "line-through"},
//   {tag: t.link,
//    color: accent,
//    textDecoration: "underline"},
//   {tag: t.heading,
//    fontWeight: "bold",
//    color: coral},
//   {tag: [t.atom, t.bool, t.special(t.variableName)],
//    color: whiskey },
//   {tag: [t.processingInstruction, t.string, t.inserted],
//    color: sage},
//   {tag: t.invalid,
//    color: invalid},
// ])

// /// Extension to enable the One Dark theme (both the editor theme and
// /// the highlight style).
// export const oneDark: Extension = [myTheme, syntaxHighlighting(myHighlightStyle)]

// VSCode Dark theme color definitions
const background = '#1e1e1e',
  foreground = '#9cdcfe',
  caret = '#c6c6c6',
  selection = '#6199ff2f',
  selectionMatch = '#72a1ff59',
  lineHighlight = '#ffffff0f',
  gutterBackground = '#1e1e1e',
  gutterForeground = '#838383',
  gutterActiveForeground = '#ffffff',
  keywordColor = '#569cd6',
  controlKeywordColor = '#c586c0',
  variableColor = '#9cdcfe',
  classTypeColor = '#4ec9b0',
  functionColor = '#dcdcaa',
  numberColor = '#b5cea8',
  operatorColor = '#d4d4d4',
  regexpColor = '#d16969',
  stringColor = '#ce9178',
  commentColor = '#6a9955',
  invalidColor = '#ff0000';

// Define the editor theme styles for VSCode Dark
export const vsCodeDarkTheme = EditorView.theme(
  {
    '&': {
      color: foreground,
      backgroundColor: background,
      fontFamily:
        'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    },
    '.cm-content': {
      caretColor: caret,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: caret,
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: selection,
      },
    '.cm-searchMatch': {
      backgroundColor: selectionMatch,
      outline: `1px solid ${lineHighlight}`,
    },
    '.cm-activeLine': {
      backgroundColor: lineHighlight,
    },
    '.cm-gutters': {
      backgroundColor: gutterBackground,
      color: gutterForeground,
    },
    '.cm-activeLineGutter': {
      color: gutterActiveForeground,
    },
  },
  { dark: true },
);

// Define the highlighting style for code in the VSCode Dark theme
export const vsCodeDarkHighlightStyle = HighlightStyle.define([
  {
    tag: [
      t.keyword,
      t.operatorKeyword,
      t.modifier,
      t.color,
      t.constant(t.name),
      t.standard(t.name),
      t.standard(t.tagName),
      t.special(t.brace),
      t.atom,
      t.bool,
      t.special(t.variableName),
    ],
    color: keywordColor,
  },
  { tag: [t.controlKeyword, t.moduleKeyword], color: controlKeywordColor },
  {
    tag: [
      t.name,
      t.deleted,
      t.character,
      t.macroName,
      t.propertyName,
      t.variableName,
      t.labelName,
      t.definition(t.name),
    ],
    color: variableColor,
  },
  {
    tag: [
      t.typeName,
      t.className,
      t.tagName,
      t.number,
      t.changed,
      t.annotation,
      t.self,
      t.namespace,
    ],
    color: classTypeColor,
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: functionColor,
  },
  { tag: [t.number], color: numberColor },
  {
    tag: [t.operator, t.punctuation, t.separator, t.url, t.escape, t.regexp],
    color: operatorColor,
  },
  { tag: [t.regexp], color: regexpColor },
  {
    tag: [t.special(t.string), t.processingInstruction, t.string, t.inserted],
    color: stringColor,
  },
  { tag: [t.meta, t.comment], color: commentColor },
  { tag: t.invalid, color: invalidColor },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: commentColor, textDecoration: 'underline' },
]);

// Extension to enable the VSCode Dark theme (both the editor theme and the highlight style)
export const vsCodeDark: Extension = [
  vsCodeDarkTheme,
  syntaxHighlighting(vsCodeDarkHighlightStyle),
];