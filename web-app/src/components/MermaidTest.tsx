import React, { useEffect, useRef } from 'react';

export const MermaidTest: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        console.log('Loading mermaid...');
        const mermaid = (await import('mermaid')).default;
        console.log('Mermaid loaded:', mermaid);
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default'
        });
        console.log('Mermaid initialized');

        const testChart = `
graph TD
    A[Start] --> B[Process]
    B --> C[End]
        `;

        if (elementRef.current) {
          elementRef.current.innerHTML = `<div class="mermaid">${testChart}</div>`;
          const mermaidDiv = elementRef.current.querySelector('.mermaid');
          
          if (mermaidDiv) {
            console.log('Rendering mermaid chart...');
            await mermaid.init(undefined, mermaidDiv);
            console.log('Mermaid chart rendered successfully');
          }
        }
      } catch (error) {
        console.error('Mermaid error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<div style="color: red;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
      }
    };

    loadMermaid();
  }, []);

  return (
    <div>
      <h3>Mermaid Test</h3>
      <div ref={elementRef} style={{ minHeight: '200px', border: '1px solid #ccc', padding: '20px' }}>
        Loading...
      </div>
    </div>
  );
};