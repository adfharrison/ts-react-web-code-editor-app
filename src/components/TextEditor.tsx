import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { setServers } from 'dns';

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');

  // set up a ref and bind it to the div containing the full editor component
  const toggleRef = useRef<HTMLDivElement | null>(null);

  // set up a listener for clicks anywhere that isnt the markdown editor, to close it
  useEffect(() => {
    // set up a method for click listener to call when click happens
    const listener = (event: MouseEvent) => {
      // if ref has had time to initiate, we have a click event, and that click event targets the div we are reffing,
      if (
        toggleRef.current &&
        event.target &&
        toggleRef.current.contains(event.target as Node)
      ) {
        // return without toggling the editor view
        return;
      }
      // else toggle the editor view
      setEditing(false);
    };
    //start a click event listener, pass in our method
    document.addEventListener('click', listener, { capture: true });

    // unsubscribe the listener
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  // show editor
  if (editing) {
    return (
      <div ref={toggleRef} className='text-editor'>
        <MDEditor
          value={value}
          onChange={(v) => {
            setValue(v || '');
          }}
        />
      </div>
    );
  }
  return (
    // show MD preview only, when you click in it, it opens the full editor
    <div
      onClick={() => {
        setEditing(true);
      }}
      className='text-editor card'
    >
      <div className='card-content'>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
