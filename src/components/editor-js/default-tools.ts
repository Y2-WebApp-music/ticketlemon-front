import type { EditorConfig } from "@editorjs/editorjs"

type EditorTools = EditorConfig["tools"]
// Alignment: block tune (left/center/right). Export is named.
// @ts-expect-error - UMD bundle, no types
import AlignmentPkg from "editorjs-text-alignment-blocktune"
// Text color: inline tool for Editor.js 2 (select text → change color)
import ColorPicker from "editorjs-color-picker"

const AlignmentTuneTool = AlignmentPkg?.AlignmentBlockTune ?? AlignmentPkg

import Paragraph from "@editorjs/paragraph"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Quote from "@editorjs/quote"
// @ts-expect-error - embed package exports don't expose types in package.json exports
import Embed from "@editorjs/embed"
// @ts-expect-error - link package has no types in exports
import Link from "@editorjs/link"
import Delimiter from "@editorjs/delimiter"
import Table from "@editorjs/table"
// @ts-expect-error - marker package has no types in exports
import Marker from "@editorjs/marker"
import NestedList from "@editorjs/nested-list"

/**
 * Default Editor.js tools: Header, List, Quote, Embed (link embeds),
 * Table, Marker (highlight), Nested List, Link, Delimiter.
 * Paragraph is built-in in Editor.js 2.
 * Type assertion used for compatibility between Editor.js 2 types and 1.x tool packages.
 */
const toolsObj = {
  ...(AlignmentTuneTool && {
    alignmentTune: {
      class: AlignmentTuneTool,
      config: { default: "left" as const },
    },
  }),
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    ...(AlignmentTuneTool && { tunes: ["alignmentTune"] as const }),
    config: {
      placeholder: "Write your content…",
    },
  },
  header: {
    class: Header,
    ...(AlignmentTuneTool && { tunes: ["alignmentTune"] as const }),
    config: {
      placeholder: "Enter a heading",
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    ...(AlignmentTuneTool && { tunes: ["alignmentTune"] as const }),
    config: {
      defaultStyle: "unordered",
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    ...(AlignmentTuneTool && { tunes: ["alignmentTune"] as const }),
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote author",
    },
  },
  ...(ColorPicker && {
    textColor: {
      class: ColorPicker,
      config: {
        colors: [
          "#000000",
          "#EC7878",
          "#9C27B0",
          "#3F51B5",
          "#03A9F4",
          "#4CAF50",
          "#FF9800",
          "#F44336",
        ],
        columns: 7,
      },
    },
  }),
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        twitter: true,
        instagram: true,
        codepen: true,
        vimeo: true,
        github: true,
      },
    },
  },
  link: {
    class: Link,
    config: {
      endpoint: "", // optional: backend URL to fetch link metadata
      placeholder: "Paste or type a link",
    },
  },
  delimiter: {
    class: Delimiter,
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  nestedlist: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
}

export const defaultEditorTools = toolsObj as unknown as EditorTools
