import PageLayout from "@/components/ui/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CreditCard, Landmark, Shield, Truck, Banknote, Lock } from "lucide-react";

const PaymentMethodsPage = () => {
  return (
    <PageLayout title="Payment Methods">
      <div className="max-w-4xl mx-auto">
        <p className="mb-8">
          At DASH, we offer a variety of secure payment options to make your shopping experience as convenient as possible. 
          Choose the payment method that works best for you from the options below.
        </p>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Available Payment Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <CreditCard className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Credit/Debit Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We accept all major credit and debit cards, including Visa, Mastercard, and American Express.
                </p>
                <div className="flex space-x-4">
                  <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/visa.svg" alt="Visa" className="h-8" />
                  <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/mastercard.svg" alt="Mastercard" className="h-8" />
                  <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/american-express.svg" alt="American Express" className="h-8" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <img src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/dist/flat/paypal.svg" alt="Paystack" className="h-8 w-8" />
                <CardTitle>Paystack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Paystack provides a secure and seamless payment experience. 
                  You can pay directly using your credit/debit card through the Paystack platform 
                  without having to create a Paystack account.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="h-8 w-8">
                  <path d="M6.39999 4.8C5.51999 4.8 4.79999 5.52 4.79999 6.4V25.6C4.79999 26.48 5.51999 27.2 6.39999 27.2H25.6C26.48 27.2 27.2 26.48 27.2 25.6V6.4C27.2 5.52 26.48 4.8 25.6 4.8H6.39999Z" fill="#FBAF1E"/>
                  <path d="M18.4 12.8C18.4 14.56 16.96 16 15.2 16C13.44 16 12 14.56 12 12.8C12 11.04 13.44 9.6 15.2 9.6C16.96 9.6 18.4 11.04 18.4 12.8Z" fill="#1A1A1A"/>
                  <path d="M21.6 19.2C21.6 20.96 20.16 22.4 18.4 22.4C16.64 22.4 15.2 20.96 15.2 19.2C15.2 17.44 16.64 16 18.4 16C20.16 16 21.6 17.44 21.6 19.2Z" fill="white"/>
                </svg>
                <CardTitle>Flutterwave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Flutterwave allows for fast and secure payments using multiple payment methods 
                  including cards, mobile money, bank transfers, and more. 
                  It's a versatile option for both local and international customers.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Landmark className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Bank Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  For orders over ₦100,000, you can choose to pay via bank transfer. After placing your order, 
                  you'll receive our bank details and a unique reference number. Your order will be processed 
                  once we confirm receipt of your payment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Truck className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Pay on Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Available in select locations within Lagos, Abuja, and Port Harcourt for orders under ₦200,000. 
                  You can pay with cash or card when your order is delivered to your doorstep. 
                  A small reservation fee may be required at checkout.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Banknote className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Part Payments / Installments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  For selected high-value items, we offer the option to make a partial payment upfront 
                  and pay the balance upon delivery or in installments. This option is subject to approval 
                  and terms vary based on the order value.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Payment Security</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
            <div className="flex items-start mb-4">
              <Lock className="h-6 w-6 text-[#D4AF37] mr-3 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Secure Payment Processing</h3>
                <p className="text-gray-700">
                  All transactions on DASH are protected with industry-standard SSL encryption. 
                  We never store your full credit card information on our servers. 
                  All payment processing is handled by trusted, PCI-compliant payment processors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <Shield className="h-6 w-6 text-[#D4AF37] mr-3 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Fraud Protection</h3>
                <p className="text-gray-700">
                  We employ advanced fraud detection systems to protect both our customers and our business. 
                  Suspicious transactions are flagged for review to prevent unauthorized purchases. 
                  Your security is our priority.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CreditCard className="h-6 w-6 text-[#D4AF37] mr-3 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Secure Account Management</h3>
                <p className="text-gray-700">
                  Your saved payment methods in your DASH account are securely stored using tokenization, 
                  allowing for convenient checkout without compromising security. You can manage your saved 
                  payment methods in your account settings.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Currency & Pricing</h2>
          
          <p className="mb-4">
            All prices on DASH are displayed in Nigerian Naira (₦). For international customers, 
            the currency conversion is handled by your card issuer or payment processor at the time of purchase. 
            Please note that the exchange rate used is determined by your bank or payment provider, not by DASH.
          </p>
          
          <p>
            For in-store purchases, our staff can process transactions in multiple currencies including 
            Nigerian Naira (₦), US Dollars ($), and British Pounds (£). Currency exchange rates for in-store 
            purchases are updated daily based on market rates.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Payment FAQs</h2>
          
          <div className="space-y-4">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">When will my card be charged?</h3>
              <p className="text-gray-700">
                Your card will be authorized at the time of purchase and charged when your order is shipped. 
                For pre-orders or back-ordered items, your card will be charged when the item is ready to ship.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">What should I do if my payment is declined?</h3>
              <p className="text-gray-700">
                If your payment is declined, first verify that all information was entered correctly. 
                Contact your bank to ensure there are no restrictions on your card. 
                You can also try using a different payment method or contact our customer service team for assistance.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Are there any additional fees?</h3>
              <p className="text-gray-700">
                DASH does not add any surcharges or fees for using specific payment methods. 
                However, your bank or payment provider may apply their own fees, especially for international transactions. 
                Shipping fees and taxes are calculated at checkout and displayed before you complete your purchase.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">How are refunds processed?</h3>
              <p className="text-gray-700">
                Refunds are issued to the original payment method used for the purchase. 
                The time it takes for the refund to appear in your account depends on your payment provider's processing time, 
                typically 5-10 business days after the refund is initiated.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-serif font-medium mb-4">Need Assistance?</h2>
          <p className="mb-4">
            If you have any questions about payment methods or encounter any issues during checkout, 
            our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-black hover:bg-[#D4AF37] text-white" asChild>
              <Link href="/info/contact">Contact Customer Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/info/faqs">View FAQs</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default PaymentMethodsPage;