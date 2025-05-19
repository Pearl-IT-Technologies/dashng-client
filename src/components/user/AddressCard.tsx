import { useState } from "react";
import { UserAddress } from "@/hooks/use-user-addresses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Home, Pencil, Star, Trash2 } from "lucide-react";
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

interface AddressCardProps {
  address: UserAddress;
  isDefault: boolean;
  onEdit: (address: UserAddress) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card className={`${isDefault ? 'border-[#D4AF37]' : 'border-gray-200'} transition-all duration-300 hover:shadow-md hover:border-[#D4AF37]/50`}>
      <CardContent className="p-4">
        {isDefault && (
          <div className="flex items-center text-[#D4AF37] mb-2 bg-[#D4AF37]/10 py-1 px-2 rounded text-sm">
            <Check className="h-3.5 w-3.5 mr-1" />
            <span>Default Address</span>
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Home className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-lg">{address.addressType}</h3>
            </div>
            <p className="text-gray-700">{address.recipientName}</p>
            <p className="text-gray-600 mt-2">{address.addressLine1}</p>
            {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
            <p className="text-gray-600">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-gray-600">{address.country}</p>
            {address.phoneNumber && <p className="text-gray-600 mt-1">{address.phoneNumber}</p>}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(address)}
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
                onClick={() => onSetDefault(address.id)}
                className="h-8 w-8 text-[#D4AF37]"
                title="Set as default address"
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
              This will permanently delete this address. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => onDelete(address.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}