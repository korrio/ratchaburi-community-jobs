import React, { useEffect, useState } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ value, size = 200, className = '' }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (typeof window !== 'undefined') {
          const QRCode = (await import('qrcode')).default;
          const dataURL = await QRCode.toDataURL(value, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeDataURL(dataURL);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        setLoading(false);
      }
    };

    generateQR();
  }, [value, size]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!qrCodeDataURL) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-sm">QR Code Error</span>
      </div>
    );
  }

  return (
    <img 
      src={qrCodeDataURL} 
      alt="QR Code" 
      className={`${className}`}
      style={{ width: size, height: size }}
    />
  );
};