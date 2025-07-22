import React, { useRef, useEffect, useState } from 'react';
const TRUSTED_ORIGIN = 'http://localhost:5500';

const IframeComponent: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    console.log('!!! window.addEventListener !!!');

    const messageHandler = (event: MessageEvent) => {
      console.log('Message received from iframe:', event.data, event.origin);

      // Validate origin
      if (event.origin !== TRUSTED_ORIGIN) {
        console.warn('Untrusted origin:', event.origin);
        return;
      }

      if (event.data.type === 'FROM_WEBVIEW') {
        console.log('Message from iframe (postMessage):', event.data.message);
        setMessage(JSON.stringify(event.data));
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const sendIframeData = () => {
    console.log('iframeRef.current:', iframeRef.current);
    if (iframeRef.current) {
      console.log('Sending data to iframe...');
      iframeRef.current.contentWindow?.postMessage(
        { type: 'FROM_PARENT', message: 'Hello from Electron!' },
        '*'
      );
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h2>IFrame Component</h2>
      <button
        data-testid="send-to-iframe"
        className="mx-4 my-4 bg-transparent dark:bg-white/5"
        onClick={sendIframeData}
      >
        Send to iframe
      </button>
      <div>Receive message from iframe: {message}</div>
      <iframe
        ref={iframeRef}
        src="http://localhost:5500/src/components/Webview/test.html"
        style={{ width: '100%', height: '100%', background: 'white' }}
        sandbox="allow-scripts allow-same-origin allow-popups"
        title="Embedded Iframe"
      />
    </div>
  );
};

export default IframeComponent;
