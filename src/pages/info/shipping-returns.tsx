import PageLayout from "@/components/ui/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ShippingReturnsPage = () => {
  const lastUpdated = "April 20, 2025";

  return (
    <PageLayout title="Shipping & Returns">
      <p className="mb-4 text-gray-600">Last Updated: {lastUpdated}</p>
      
      <p className="mb-8">
        At DASH, we strive to make your shopping experience as seamless as possible. 
        Our shipping and returns policies are designed to ensure your satisfaction with every purchase.
      </p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Shipping Information</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">Delivery Options</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4 border">Delivery Method</th>
                  <th className="text-left py-3 px-4 border">Estimated Delivery Time</th>
                  <th className="text-left py-3 px-4 border">Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border">Standard Delivery</td>
                  <td className="py-3 px-4 border">2-5 business days</td>
                  <td className="py-3 px-4 border">₦2,500 (Free for orders over ₦50,000)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">Express Delivery</td>
                  <td className="py-3 px-4 border">1-2 business days</td>
                  <td className="py-3 px-4 border">₦5,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border">Same-Day Delivery (Lagos only)</td>
                  <td className="py-3 px-4 border">Same day (for orders placed before 12pm)</td>
                  <td className="py-3 px-4 border">₦7,500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border">International Shipping</td>
                  <td className="py-3 px-4 border">7-14 business days</td>
                  <td className="py-3 px-4 border">Starting from ₦15,000 (varies by location)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-medium mb-2">Shipping Policies</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="order-processing">
              <AccordionTrigger className="text-lg font-medium">Order Processing Time</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
                <p>For items that are pre-order or made-to-order, please note the estimated processing time mentioned on the product page.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping-calculation">
              <AccordionTrigger className="text-lg font-medium">How Shipping Costs Are Calculated</AccordionTrigger>
              <AccordionContent>
                <p>Shipping costs are calculated based on the delivery method chosen, the weight and dimensions of the items in your order, and your delivery location. The exact shipping cost will be displayed at checkout before you complete your purchase.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tracking-order">
              <AccordionTrigger className="text-lg font-medium">Tracking Your Order</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Once your order has been shipped, you will receive a confirmation email with your tracking number and a link to track your package.</p>
                <p>You can also track your order by logging into your DASH account and viewing your order history, or by using the Order Tracking feature on our website.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="delivery-areas">
              <AccordionTrigger className="text-lg font-medium">Delivery Areas</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We deliver to all states in Nigeria, with fastest service available in Lagos, Abuja, and Port Harcourt.</p>
                <p className="mb-2">For international orders, we currently deliver to select countries in Africa, Europe, North America, and Asia. Please contact our customer service team to confirm delivery availability to your location.</p>
                <p>Some remote areas may require additional delivery time or incur additional fees.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping-delays">
              <AccordionTrigger className="text-lg font-medium">Shipping Delays</AccordionTrigger>
              <AccordionContent>
                <p>Occasionally, shipping may be delayed due to circumstances beyond our control, such as weather conditions, customs processing for international orders, or logistical challenges. We will notify you as soon as possible if there is a significant delay in the delivery of your order.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Returns & Exchanges</h2>
        
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-medium mb-2">Return Policy</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="return-eligibility">
              <AccordionTrigger className="text-lg font-medium">Return Eligibility</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We accept returns within 14 days of delivery for most items, provided they are in their original condition with tags attached and original packaging intact.</p>
                <p className="mb-2">The following items are not eligible for return:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                  <li>Personalized or custom-made items</li>
                  <li>Intimates, swimwear, and jewelry (for hygiene reasons)</li>
                  <li>Items that have been worn, washed, altered, or damaged</li>
                </ul>
                <p>For items received damaged or defective, please contact our customer service within 48 hours of delivery.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="return-process">
              <AccordionTrigger className="text-lg font-medium">Return Process</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">To initiate a return, please follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-2 mb-2">
                  <li>Log in to your DASH account and navigate to your order history</li>
                  <li>Select the order containing the item(s) you wish to return</li>
                  <li>Click on "Request Return" and follow the prompts</li>
                  <li>Print the return shipping label (if provided) or note the return address</li>
                  <li>Package the item(s) securely in their original packaging</li>
                  <li>Attach the shipping label and drop off the package at the designated courier service</li>
                </ol>
                <p>Alternatively, you can contact our customer service team for assistance with your return.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="refund-process">
              <AccordionTrigger className="text-lg font-medium">Refund Process</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Once we receive and inspect your return, we will process your refund within 5-7 business days. The refund will be issued to the original payment method used for the purchase.</p>
                <p className="mb-2">Please note that shipping fees are non-refundable unless the return is due to our error (such as sending the wrong item or a defective product).</p>
                <p>For items purchased using a promotional discount, the refund amount will be adjusted accordingly.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="exchanges">
              <AccordionTrigger className="text-lg font-medium">Exchanges</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We offer exchanges for items in different sizes or colors, subject to availability. To request an exchange:</p>
                <ol className="list-decimal pl-6 space-y-2 mb-2">
                  <li>Follow the return process as outlined above</li>
                  <li>Select "Exchange" instead of "Return" and specify the desired replacement item</li>
                  <li>If the exchange item has a different price, you will be charged or refunded the difference</li>
                </ol>
                <p>Please note that we can only process one exchange per order. If you need to exchange an item after already receiving an exchange, you will need to return the item for a refund and place a new order.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="return-shipping">
              <AccordionTrigger className="text-lg font-medium">Return Shipping</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Customers are responsible for return shipping costs unless the return is due to our error (wrong item shipped, defective product, etc.).</p>
                <p className="mb-2">For returns due to our error, we will provide a prepaid return shipping label or reimburse your return shipping costs.</p>
                <p>We recommend using a trackable shipping method for returns to ensure that your package can be traced if necessary.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-serif font-medium mb-6">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our shipping and returns policies, please don't hesitate to contact our customer service team:
        </p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>Email: support@dashng.com</p>
          <p>Phone: +234 123 456 7890</p>
          <p>Hours: Monday to Friday, 9am - 6pm | Saturday, 10am - 4pm</p>
        </div>
      </section>
    </PageLayout>
  );
};

export default ShippingReturnsPage;