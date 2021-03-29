import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
  bundlingError: string;
}

// insert our users code as the script used inside the html inside the iframe. the script listens to message events from the parent frame
// to retrieve and run the code in the textArea. the div with id root is so users can utilise react. eval compiles the string into JS
const html = `
<html>
<head>
  <style>html { background-color: white; }</style>
</head>
<body>
  <div id="root"></div>
  <script>
    const handleError = (err) => {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
      console.error(err);
    };
    window.addEventListener('error', ()=>{
      event.preventDefault()
      handleError(event.error)
    })
    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    }, false);
  </script>
</body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const iframe = useRef<any>();
  //every time the code pushed to the iframe chages, refresh the iframe
  useEffect(() => {
    // reset the contents of the iframe on submission of new code
    iframe.current.srcdoc = html;

    // makes sure the browser has enough time to set up the message listener before we send this message
    setTimeout(() => {
      // send a message to the iframe containing the code the user has entered in the textArea. the * is so all domains can hear it
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        //   {/* srcDoc can assign the contents of the iframe to be a locally stored string */}
        title='preview'
        srcDoc={html}
        sandbox='allow-scripts'
        ref={iframe}
      />
      {bundlingError && <div className='preview-error'>{bundlingError}</div>}
    </div>
  );
};

export default Preview;
