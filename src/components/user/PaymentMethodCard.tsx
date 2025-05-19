import { useState } from "react";
import { UserPaymentMethod } from "@/hooks/use-user-payment-methods";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CreditCard, Pencil, Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentMethodCardProps {
  paymentMethod: UserPaymentMethod;
  isDefault: boolean;
  onEdit: (paymentMethod: UserPaymentMethod) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function PaymentMethodCard({
  paymentMethod,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Format credit card number with asterisks for security
  const formatCardNumber = (cardNumber: string | null) => {
    if (!cardNumber) return "";
    
    // Show last 4 digits only
    const lastFourDigits = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  };

  const getCardIcon = () => {
    if (!paymentMethod.cardType) return <CreditCard className="h-5 w-5" />;
    
    const cardType = paymentMethod.cardType.toLowerCase();
    
    // Different styling based on card type
    if (cardType.includes("visa")) {
      return <CreditCard className="h-5 w-5 text-blue-600" />;
    } else if (cardType.includes("mastercard")) {
      return <CreditCard className="h-5 w-5 text-red-600" />;
    } else if (cardType.includes("amex") || cardType.includes("american")) {
      return <CreditCard className="h-5 w-5 text-green-600" />;
    }
    
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <Card className={`${isDefault ? 'border-[#D4AF37]' : 'border-gray-200'} transition-all duration-300 hover:shadow-md hover:border-[#D4AF37]/50`}>
      <CardContent className="p-4">
        {isDefault && (
          <div className="flex items-center text-[#D4AF37] mb-2 bg-[#D4AF37]/10 py-1 px-2 rounded text-sm">
            <Check className="h-3.5 w-3.5 mr-1" />
            <span>Default Payment Method</span>
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {getCardIcon()}
              <h3 className="font-medium text-lg">
                {paymentMethod.nickname || paymentMethod.methodType}
              </h3>
            </div>
            
            {paymentMethod.cardNumber && (
              <p className="text-gray-600 font-mono">
                {formatCardNumber(paymentMethod.cardNumber)}
              </p>
            )}
            
            {paymentMethod.cardholderName && (
              <p className="text-gray-600 mt-1">
                {paymentMethod.cardholderName}
              </p>
            )}
            
            {paymentMethod.cardExpiry && (
              <p className="text-gray-500 text-sm mt-1">
                Expires: {paymentMethod.cardExpiry}
              </p>
            )}
            
            {paymentMethod.billingAddress && (
              <p className="text-gray-500 text-sm mt-2">
                Billing: {paymentMethod.billingAddress}
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(paymentMethod)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {!isDefault && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSetDefault(paymentMethod.id)}
                className="h-8 w-8 text-[#D4AF37]"
                title="Set as default payment method"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment method. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => onDelete(paymentMethod.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}