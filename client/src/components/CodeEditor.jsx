import React, { useRef, forwardRef } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = forwardRef(({ code, setCode, language = "java", onCheatAttempt, height = "100%" }, ref) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define LeetCode-style dark theme
    monaco.editor.defineTheme('leetcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C678DD' },
        { token: 'string', foreground: '98C379' },
        { token: 'number', foreground: 'D19A66' },
        { token: 'type', foreground: 'E5C07B' },
        { token: 'function', foreground: '61AFEF' },
        { token: 'variable', foreground: 'E06C75' },
        { token: 'operator', foreground: '56B6C2' },
      ],
      colors: {
        'editor.background': '#1A1A2E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2A3E',
        'editor.selectionBackground': '#3E4451',
        'editorLineNumber.foreground': '#495162',
        'editorLineNumber.activeForeground': '#848DA0',
        'editorCursor.foreground': '#FFFFFF',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorIndentGuide.background': '#2A2A3E',
        'editorIndentGuide.activeBackground': '#3E4451',
        'editorWidget.background': '#1A1A2E',
        'editorWidget.border': '#2D2D44',
        'editorSuggestWidget.background': '#1A1A2E',
        'editorSuggestWidget.border': '#2D2D44',
        'editorSuggestWidget.selectedBackground': '#2A2A3E',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#3E445180',
        'scrollbarSlider.hoverBackground': '#3E4451B0',
        'scrollbarSlider.activeBackground': '#3E4451E0',
      }
    });

    monaco.editor.setTheme('leetcode-dark');

    // Add event listener to detect and prevent cheating attempts
    editor.onKeyDown((event) => {
      const { keyCode, ctrlKey, metaKey, shiftKey } = event;

      // Block copy (Ctrl/Cmd + C)
      if ((keyCode === monaco.KeyCode.KeyC) && (ctrlKey || metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("copy");
        return;
      }

      // Block paste (Ctrl/Cmd + V) 
      if ((keyCode === monaco.KeyCode.KeyV) && (ctrlKey || metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("paste");
        return;
      }

      // Block cut (Ctrl/Cmd + X)
      if ((keyCode === monaco.KeyCode.KeyX) && (ctrlKey || metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("cut");
        return;
      }

      // Block select all (Ctrl/Cmd + A)
      if ((keyCode === monaco.KeyCode.KeyA) && (ctrlKey || metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("select_all");
        return;
      }

      // Block undo (Ctrl/Cmd + Z)
      if ((keyCode === monaco.KeyCode.KeyZ) && (ctrlKey || metaKey) && !shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("undo");
        return;
      }

      // Block redo (Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z)
      if (((keyCode === monaco.KeyCode.KeyY) && (ctrlKey || metaKey)) ||
        ((keyCode === monaco.KeyCode.KeyZ) && (ctrlKey || metaKey) && shiftKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("redo");
        return;
      }

      // Block F12 (Developer Tools)
      if (keyCode === monaco.KeyCode.F12) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("dev_tools");
        return;
      }

      // Block Ctrl+Shift+I (Developer Tools)
      if ((keyCode === monaco.KeyCode.KeyI) && (ctrlKey || metaKey) && shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("dev_tools");
        return;
      }

      // Block Ctrl+Shift+J (Console)
      if ((keyCode === monaco.KeyCode.KeyJ) && (ctrlKey || metaKey) && shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("dev_tools");
        return;
      }

      // Block Ctrl+U (View Source)
      if ((keyCode === monaco.KeyCode.KeyU) && (ctrlKey || metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        onCheatAttempt?.("view_source");
        return;
      }
    });
  };

  const editorOptions = {
    contextmenu: false,
    selectOnLineNumbers: false,
    dragAndDrop: false,
    links: false,
    wordWrap: "on",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    readOnly: false,
    fontSize: 14,
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontLigatures: true,
    lineNumbers: "on",
    lineHeight: 22,
    roundedSelection: false,
    renderLineHighlight: 'line',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    padding: { top: 12, bottom: 12 },
    folding: true,
    foldingHighlight: true,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      alwaysConsumeMouseWheel: false,
    },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    renderWhitespace: 'none',
  };

  return (
    <Editor
      height={height}
      width="100%"
      language={language}
      value={code}
      onChange={(value) => setCode(value)}
      theme="leetcode-dark"
      onMount={handleEditorDidMount}
      options={editorOptions}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1A1A2E]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-sm text-neutral-400">Loading editor...</span>
          </div>
        </div>
      }
    />
  );
});

export default CodeEditor;
