import { useState } from "react";
import { UserPaymentMethod } from "@/hooks/use-user-payment-methods";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema with validation
const paymentMethodSchema = z.object({
  methodType: z.string().min(1, { message: "Payment method type is required" }),
  cardNumber: z.string().optional(),
  cardType: z.string().optional(),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, { 
    message: "Expiry date must be in MM/YY format" 
  }).optional(),
  cardholderName: z.string().optional(),
  billingAddress: z.string().optional(),
  nickname: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSubmit: (data: PaymentMethodFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<UserPaymentMethod>;
  isSubmitting: boolean;
}

export function PaymentMethodForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
}: PaymentMethodFormProps) {
  const [paymentTypes] = useState([
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Bank Transfer",
    "USSD",
    "Paystack",
    "Flutterwave",
    "Cash",
    "Other",
  ]);

  const [cardTypes] = useState([
    "Visa",
    "Mastercard",
    "American Express",
    "Discover",
    "Verve",
    "Other",
  ]);

  // Default form values
  const defaultValues: Partial<PaymentMethodFormValues> = {
    methodType: "Credit Card",
    cardNumber: "",
    cardType: "",
    cardExpiry: "",
    cardholderName: "",
    billingAddress: "",
    nickname: "",
    isDefault: false,
    ...initialData,
  };

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  // Watch method type to conditionally show card fields
  const methodType = form.watch("methodType");
  const showCardFields = methodType === "Credit Card" || methodType === "Debit Card";

  return (
    <div className="bg-white p-5 rounded-lg border">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-medium">
          {initialData?.id ? "Edit Payment Method" : "Add New Payment Method"}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="methodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method Type*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., My Personal Card" 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormDescription>
                  A friendly name to help you recognize this payment method
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {showCardFields && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="XXXX XXXX XXXX XXXX" 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cardTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Name on card" 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="MM/YY" 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Billing address (optional)" 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Set as default payment method</FormLabel>
                  <FormDescription>
                    This will be your default payment method for future purchases.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#D4AF37] hover:bg-[#C09C1F] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Payment Method"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}