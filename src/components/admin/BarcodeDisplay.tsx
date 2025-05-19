import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeDisplayProps {
  value: string;
  displayValue?: boolean;
  width?: number;
  height?: number;
  productName?: string;
  productId?: number;
  showActions?: boolean;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  value,
  displayValue = true,
  width = 1,
  height = 50,
  productName,
  productId,
  showActions = true
}) => {
  const { toast } = useToast();
  const barcodeRef = useRef<HTMLDivElement>(null);
  
  // Print the barcode
  const handlePrint = () => {
    if (!barcodeRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Print failed',
        description: 'Could not open print window. Please check your browser settings.',
        variant: 'destructive'
      });
      return;
    }
    
    // Get barcode SVG
    const barcodeSvg = barcodeRef.current.querySelector('svg');
    if (!barcodeSvg) return;
    
    // Create a printable HTML document
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode: ${productName || value}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .container {
              display: inline-block;
              border: 1px dashed #ccc;
              padding: 15px;
              margin-bottom: 10px;
            }
            .product-details {
              margin-top: 10px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                padding: 0;
              }
              .print-button {
                display: none;
              }
              .container {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${barcodeSvg.outerHTML}
            ${productName ? `<div class="product-details">${productName}</div>` : ''}
            ${productId ? `<div class="product-details">ID: ${productId}</div>` : ''}
          </div>
          <div>
            <button class="print-button" onclick="window.print();window.close();">
              Print Barcode
            </button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    toast({
      title: 'Ready to print',
      description: 'Print dialog should open in a new window',
    });
  };
  
  // Download barcode as SVG
  const handleDownload = () => {
    if (!barcodeRef.current) return;
    
    const barcodeSvg = barcodeRef.current.querySelector('svg');
    if (!barcodeSvg) return;
    
    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(barcodeSvg);
    
    // Create a Blob from the SVG string
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${value}-${productName || 'product'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Barcode downloaded',
      description: 'SVG file has been downloaded.',
    });
  };
  
  return (
    <div className="flex flex-col items-center">
      <div ref={barcodeRef} className="barcode-container">
        <Barcode 
          value={value} 
          displayValue={displayValue}
          width={width}
          height={height}
          format="CODE128"
        />
      </div>
      
      {showActions && (
        <div className="flex space-x-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handlePrint}
            title="Print Barcode"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
            title="Download Barcode as SVG"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default BarcodeDisplay;