import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReturnPolicyProps {
  simplified?: boolean;
  productName?: string;
}

export const ReturnPolicy: React.FC<ReturnPolicyProps> = ({ 
  simplified = false,
  productName = "this product"
}) => {
  if (simplified) {
    return (
      <Alert className="bg-gray-50 border-green-100">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-sm font-medium text-green-800">7-Day Return Policy</AlertTitle>
        <AlertDescription className="text-xs text-gray-600">
          Eligible for return within 7 days of delivery
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm text-blue-600 flex items-center">
          7-Day Return Policy <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>7-Day Return Policy</DialogTitle>
          <DialogDescription>
            Our hassle-free return policy for your peace of mind.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm mt-2">
          <p>
            All products purchased from DASH NG are eligible for return within 7 days of delivery, 
            provided they meet our return conditions.
          </p>
          
          <div>
            <h4 className="font-medium mb-1">Return Conditions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Item must be unused and in original condition</li>
              <li>Original packaging must be intact</li>
              <li>All tags and labels must be attached</li>
              <li>Proof of purchase is required</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">How to Return:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Log in to your account and go to your order history</li>
              <li>Select the order containing {productName}</li>
              <li>Click the "Request Return" button</li>
              <li>Follow the instructions to complete your return request</li>
            </ol>
          </div>
          
          <Alert className="bg-amber-50 border-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-sm font-medium">Note</AlertTitle>
            <AlertDescription className="text-xs">
              Shipping costs for returns are the responsibility of the customer unless the product is defective or incorrectly shipped.
            </AlertDescription>
          </Alert>
          
          <p className="text-gray-600 text-xs">
            For any questions regarding returns, please contact our customer service at support@dash.ng
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPolicy;