import React, { useRef, forwardRef } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = forwardRef(({ code, setCode, language = "java", onCheatAttempt }, ref) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
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
    contextmenu: false, // Disable right-click context menu
    selectOnLineNumbers: false, // Disable line number selection
    dragAndDrop: false, // Disable drag and drop
    links: false, // Disable clickable links
    wordWrap: "on",
    minimap: { enabled: false }, // Disable minimap for cleaner interface
    scrollBeyondLastLine: false,
    automaticLayout: true,
    readOnly: false,
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: false,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible"
    }
  };

  return (
    <Editor
      height="415px"
      width="100%"
      language={language}
      value={code}
      onChange={(value) => setCode(value)}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={editorOptions}
    />
  );
});

export default CodeEditor;
