import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

// insert our users code as the script used inside the html inside the iframe. the script listens to message events from the parent frame
// to retrieve and run the code in the textArea. the div with id root is so users can utilise react. eval compiles the string into JS
const html = `
  <html>
  <head></head>
  <body>
  <div id="root"></div>
  <script>
  window.addEventListener('message', ((event) => {
   try { 
       eval(event.data)
    } catch(err) {
        const root = document.querySelector('#root') 
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.error(err)
    }
  }), false)
  </script>
  </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();
  //every time the code pushed to the iframe chages, refresh the iframe
  useEffect(() => {
    // reset the contents of the iframe on submission of new code
    iframe.current.srcdoc = html;

    // send a message to the iframe containing the code the user has entered in the textArea. the * is so all domains can hear it
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <div>
      <iframe
        //   {/* srcDoc can assign the contents of the iframe to be a locally stored string */}
        title='preview'
        srcDoc={html}
        sandbox='allow-scripts'
        ref={iframe}
      />
    </div>
  );
};

export default Preview;
