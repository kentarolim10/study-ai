import {  EditorState, SerializedEditorState, SerializedLexicalNode, TextNode } from "lexical";
import { type Ref, useEffect, forwardRef, useImperativeHandle } from "react";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { QuoteNode, HeadingNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

const theme = {
  root: "p-2 border-none rounded h-auto min-h-[200px] focus:outline-none w-full",
  link: "cursor-pointer",
  text: {
    bold: "font-semibold",
    underline: "underline decoration-wavy",
    italic: "italic",
    strikethrough: "line-through",
    underlineStrikethrough: "underlined-line-through",
  },
};

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  throw error;
}

type EditorProps = {
  addKeyword: (nodeId: string) => void;
  removeKeyword: (nodeId: string) => void;
  editorState: SerializedEditorState<SerializedLexicalNode> | null;
};

export type GetSerializedEditorState = {
  getSerializedEditorState: () => SerializedEditorState<SerializedLexicalNode>;
};

export default forwardRef(function Editor(
  { addKeyword, removeKeyword, editorState }: EditorProps,
  ref: Ref<GetSerializedEditorState>
) {
  const initialConfig = {
    namespace: "MyEditor",
    editorState: editorState ? JSON.stringify(editorState) : undefined,
    nodes: [
      TableNode,
      TableCellNode,
      TableRowNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      HeadingNode,
      QuoteNode,
    ],
    theme,
    onError,
  };

  return (
    <>
      <div className="editor-container relative rounded border-2 border-input">
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={
              <div className="pointer-events-none absolute left-[0.5rem] top-[0.5rem]">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
          <TabIndentationPlugin />
          <TablePlugin />
          <CheckListPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <TabIndentationPlugin />
          <TranscriptKeyPlugin
            addKeyword={addKeyword}
            removeKeyword={removeKeyword}
          />
          <GetSerializedEditorStatePlugin ref={ref} />
        </LexicalComposer>
      </div>
    </>
  );
});

const GetSerializedEditorStatePlugin = forwardRef(
  function GetSerializedEditorState(_, ref: Ref<GetSerializedEditorState>) {
    const [editor] = useLexicalComposerContext();

    useImperativeHandle(ref, () => ({
      getSerializedEditorState() {
        return editor.getEditorState().toJSON();
      },
    }));

    return null;
  }
);

function TranscriptKeyPlugin({
  addKeyword,
  removeKeyword,
}: Pick<EditorProps, "addKeyword" | "removeKeyword">) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerMutationListener(TextNode, (idMutation) => {
      for (const [key, value] of idMutation.entries()) {
        if (value === "created") {
          addKeyword(key);
        } else if (value === "destroyed") {
          removeKeyword(key);
        }
      }
    });
  });

  return null;
}

function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="tree-view-output"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      treeTypeButtonClassName="e"
      editor={editor}
    />
  );
}
