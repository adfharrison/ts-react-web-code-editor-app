import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

import React, { useRef } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  // set up a ref to the editor window

  const editorRef = useRef<any>();
  // this is how we get the current content value of the editor, and pass it up intp the App state
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // set the ref to the content value of the editor
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    // change tab space length
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    // set up highlighter and jscodeshift
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );
    // this is to stop highLighter from throwing errors to the console, as it tries to parse on every keystroke
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue();
    // format current value
    const formatted = prettier
      .format(unformatted, {
        // congigure prettier settings
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\/n$/, '');
    //  the above removes any extra lines after formatting
    // put formatted value into editor
    editorRef.current.setValue(formatted);
  };
  return (
    <div className='editor-wrapper'>
      {/* format button */}
      <button
        onClick={onFormatClick}
        className='button button-format is-primary is-small'
      >
        Format
      </button>
      {/* configure the editor window */}
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        height='100%'
        language='javascript'
        theme='dark'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
