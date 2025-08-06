declare module 'mermaid' {
  interface MermaidAPI {
    initialize: (config?: any) => void;
    init: (config?: any, nodes?: string | Element | NodeList) => Promise<void>;
    render: (id: string, text: string, container?: Element) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>;
    parse: (text: string) => boolean;
    mermaidAPI: any;
  }

  const mermaid: MermaidAPI;
  export default mermaid;
}

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number; useCORS?: boolean };
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  interface Html2Pdf {
    set: (options: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement | null) => Html2Pdf;
    save: () => Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    width?: number;
    height?: number;
  }

  function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;

  export default html2canvas;
}