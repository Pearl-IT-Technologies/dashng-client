import PageLayout from "@/components/ui/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const FAQsPage = () => {
  return (
    <PageLayout title="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto">
        <p className="mb-8">
          Find answers to the most commonly asked questions about shopping with DASH. 
          If you can't find what you're looking for, please don't hesitate to contact our customer service team.
        </p>
        
        <div className="mb-12">
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#account">Account & Registration</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#ordering">Ordering</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#payment">Payment</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#shipping">Shipping & Delivery</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#returns">Returns & Refunds</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="#product">Product Information</Link>
            </Button>
          </div>
        </div>
        
        <section id="account" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Account & Registration</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="create-account">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Creating an account at DASH is simple and fast:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Click on the "Account" icon in the top right corner of the page</li>
                  <li>Select "Register"</li>
                  <li>Fill in your details including your name, email address, and chosen password</li>
                  <li>Verify your email address by clicking on the link sent to your email</li>
                  <li>Once verified, you can log in and start shopping</li>
                </ol>
                <p>Having an account allows you to track orders, save payment information, and enjoy a personalized shopping experience.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="forgot-password">
              <AccordionTrigger>I forgot my password. How can I reset it?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If you've forgotten your password, you can reset it by following these steps:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Click on the "Account" icon and select "Login"</li>
                  <li>Click on "Forgot Password?" below the login form</li>
                  <li>Enter the email address associated with your account</li>
                  <li>Check your email for a password reset link</li>
                  <li>Click the link and follow the instructions to create a new password</li>
                </ol>
                <p>If you don't receive the reset email within a few minutes, check your spam folder or contact our customer service for assistance.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="update-info">
              <AccordionTrigger>How do I update my account information?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">To update your account information:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Log in to your DASH account</li>
                  <li>Click on your name or the "Account" icon in the top right corner</li>
                  <li>Select "Account Settings" or "Profile"</li>
                  <li>Update your information as needed</li>
                  <li>Save your changes</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="guest-checkout">
              <AccordionTrigger>Can I shop without creating an account?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, we offer a guest checkout option. You can complete your purchase without creating an account by selecting "Checkout as Guest" during the checkout process. However, creating an account gives you additional benefits such as order tracking, faster checkout in the future, access to your order history, and exclusive offers.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section id="ordering" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Ordering</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="track-order">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">You can track your order in two ways:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>
                    <strong>Through your account:</strong> Log in to your DASH account, go to "Order History," select the order you want to track, and click "Track Order."
                  </li>
                  <li>
                    <strong>Using the tracking number:</strong> Visit our "Order Tracking" page, enter the tracking number provided in your order confirmation email, and click "Track."
                  </li>
                </ol>
                <p>Once your order has been shipped, you'll receive an email with your tracking information.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="modify-order">
              <AccordionTrigger>Can I modify or cancel my order after placing it?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">You can modify or cancel your order only if it hasn't been processed yet:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>To modify or cancel an order, contact our customer service team as soon as possible by phone or email.</li>
                  <li>For the fastest assistance, please have your order number ready.</li>
                  <li>Orders that have already been shipped cannot be modified or canceled. In this case, you may need to return the item according to our return policy.</li>
                </ul>
                <p>We process orders quickly, so it's best to contact us within 2 hours of placing your order if you need to make changes.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="missing-items">
              <AccordionTrigger>What should I do if items are missing from my order?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If you received your order but items are missing, please follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Check your order confirmation to verify what items were included in your order</li>
                  <li>Check if your order might have been split into multiple shipments (you would have received separate shipping notifications)</li>
                  <li>If items are indeed missing, contact our customer service within 48 hours of receiving your order</li>
                  <li>Provide your order number and details of the missing items</li>
                </ol>
                <p>Our team will investigate the issue and work to resolve it as quickly as possible, either by shipping the missing items or providing a refund.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="out-of-stock">
              <AccordionTrigger>What happens if an item in my order is out of stock?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If an item in your order becomes unavailable after you've placed your order:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>We will contact you via email to notify you of the situation</li>
                  <li>You'll be offered options such as waiting for the item to be restocked, replacing it with a similar item, or receiving a refund for that specific item</li>
                  <li>The rest of your order will proceed as normal</li>
                </ul>
                <p>Our inventory is updated in real-time, so this situation is rare, but it can occur during high-demand periods or with very popular items.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section id="payment" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Payment</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payment-methods">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We accept the following payment methods:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
                  <li>Paystack</li>
                  <li>Flutterwave</li>
                  <li>Bank transfers (for orders over ₦100,000)</li>
                  <li>Pay on Delivery (available in select locations for orders under ₦200,000)</li>
                </ul>
                <p>All payments are processed securely through our payment partners.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="payment-security">
              <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Yes, the security of your payment information is our top priority:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>We use industry-standard SSL encryption to protect all data transmitted through our website</li>
                  <li>We never store your full credit card details on our servers</li>
                  <li>All payment processing is handled by trusted, PCI-compliant payment processors</li>
                  <li>Our website undergoes regular security audits to ensure the highest level of protection</li>
                </ul>
                <p>You can shop with confidence knowing that your financial information is secure.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="order-confirmation">
              <AccordionTrigger>When will I receive my order confirmation?</AccordionTrigger>
              <AccordionContent>
                <p>You should receive an order confirmation email immediately after placing your order. If you don't receive it within 30 minutes, please check your spam folder. If it's not there, please contact our customer service team with your order details so we can confirm your order was processed correctly and resend the confirmation if necessary.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="card-declined">
              <AccordionTrigger>What should I do if my payment is declined?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If your payment is declined, here are some steps to resolve the issue:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Verify that you entered your payment information correctly</li>
                  <li>Check with your bank to ensure there are no restrictions on your card</li>
                  <li>Try using a different payment method</li>
                  <li>Ensure your billing address matches the address on file with your card issuer</li>
                </ol>
                <p>If you continue to experience issues, please contact our customer service team for assistance.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section id="shipping" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Shipping & Delivery</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shipping-costs">
              <AccordionTrigger>What are your shipping costs?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our shipping costs vary based on the delivery method and your location:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Standard Delivery: ₦2,500 (Free for orders over ₦50,000)</li>
                  <li>Express Delivery: ₦5,000</li>
                  <li>Same-Day Delivery (Lagos only): ₦7,500</li>
                  <li>International Shipping: Starting from ₦15,000 (varies by location)</li>
                </ul>
                <p>The exact shipping cost for your order will be displayed at checkout before you complete your purchase.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="delivery-time">
              <AccordionTrigger>How long will it take to receive my order?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Delivery times depend on your location and the shipping method you choose:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Standard Delivery: 2-5 business days within Nigeria</li>
                  <li>Express Delivery: 1-2 business days within Nigeria</li>
                  <li>Same-Day Delivery: Same day for orders placed before 12pm (Lagos only)</li>
                  <li>International Shipping: 7-14 business days, depending on the destination</li>
                </ul>
                <p>Please note that these are estimated delivery times and may vary due to factors such as customs clearance for international orders, weather conditions, or other circumstances beyond our control.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping-restrictions">
              <AccordionTrigger>Do you ship to all locations?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We deliver to all states in Nigeria, with the fastest service available in Lagos, Abuja, and Port Harcourt.</p>
                <p className="mb-2">For international orders, we currently deliver to select countries in Africa, Europe, North America, and Asia. Please contact our customer service team to confirm delivery availability to your location.</p>
                <p>Some remote areas may require additional delivery time or incur additional fees.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="delivery-issues">
              <AccordionTrigger>What if I'm not available to receive my delivery?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If you're not available to receive your delivery:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>The courier will attempt delivery up to three times</li>
                  <li>You can provide delivery instructions during checkout (e.g., "Leave with security" or "Leave with neighbor")</li>
                  <li>You can also contact our customer service team to reschedule the delivery or arrange for pickup from the courier's office</li>
                </ul>
                <p>For security reasons, some high-value items may require a signature upon delivery and cannot be left without someone to receive them.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section id="returns" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Returns & Refunds</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="return-policy">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our return policy allows returns within 14 days of delivery for most items, provided they are in their original condition with tags attached and original packaging intact.</p>
                <p className="mb-2">The following items are not eligible for return:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                  <li>Personalized or custom-made items</li>
                  <li>Intimates, swimwear, and jewelry (for hygiene reasons)</li>
                  <li>Items that have been worn, washed, altered, or damaged</li>
                </ul>
                <p>For a detailed overview of our return policy, please visit our <Link href="/info/shipping-returns" className="text-[#D4AF37] hover:underline">Shipping & Returns</Link> page.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="initiate-return">
              <AccordionTrigger>How do I initiate a return?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">To initiate a return, please follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
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
            
            <AccordionItem value="refund-timeline">
              <AccordionTrigger>How long does it take to process a refund?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our refund process typically follows this timeline:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Once we receive your return, we'll inspect the item(s) within 2-3 business days</li>
                  <li>After approval, we'll process your refund within 5-7 business days</li>
                  <li>The refund will be issued to the original payment method used for the purchase</li>
                  <li>Depending on your bank or payment provider, it may take an additional 5-10 business days for the refund to appear in your account</li>
                </ol>
                <p>Please note that shipping fees are non-refundable unless the return is due to our error (such as sending the wrong item or a defective product).</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="damaged-items">
              <AccordionTrigger>What if I receive a damaged or defective item?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">If you receive a damaged or defective item, please follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-2">
                  <li>Contact our customer service within 48 hours of receiving your order</li>
                  <li>Provide your order number and detailed description of the issue</li>
                  <li>Include photos of the damaged or defective item if possible</li>
                </ol>
                <p>We will arrange for a return shipping label and process a replacement or refund as quickly as possible. In this case, the return shipping costs will be covered by DASH.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section id="product" className="scroll-mt-20 mb-10">
          <h2 className="text-2xl font-serif font-medium mb-6">Product Information</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="product-authenticity">
              <AccordionTrigger>Are all products on DASH authentic?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Yes, all products sold on DASH are 100% authentic. We guarantee the authenticity of every item we sell and have strict processes in place to ensure this:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>We source our products directly from official brand distributors or authorized retailers</li>
                  <li>Our team thoroughly authenticates all products before they are listed on our platform</li>
                  <li>We provide authentication cards or certificates for luxury items</li>
                </ul>
                <p>If you have any concerns about the authenticity of a product you've received, please contact our customer service team immediately.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="product-availability">
              <AccordionTrigger>How do I know if a product is in stock?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our website displays real-time inventory information:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>If an item is in stock, you will see the available sizes and quantities on the product page</li>
                  <li>If an item is low in stock, you will see a "Low Stock" indicator</li>
                  <li>If an item is out of stock, it will be marked as "Out of Stock" or "Sold Out"</li>
                  <li>For some popular items, you may see a "Pre-order" option when we expect to restock soon</li>
                </ul>
                <p>Our inventory is updated in real-time, so the availability you see on the website is current.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="sizing-information">
              <AccordionTrigger>How can I find the right size?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">We provide several resources to help you find the right size:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Size guides are available on product pages (click on "Size Guide")</li>
                  <li>Detailed measurements are included in product descriptions</li>
                  <li>We provide fit recommendations (e.g., "True to size," "Runs small")</li>
                  <li>Customer reviews often include feedback on sizing and fit</li>
                </ul>
                <p>If you're still unsure about sizing, please contact our customer service team for personalized assistance.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="product-care">
              <AccordionTrigger>How should I care for the products I purchase?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Proper care instructions vary by product type and material:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Specific care instructions are included in the product description for each item</li>
                  <li>All products come with care labels or information cards</li>
                  <li>For luxury items, we provide specialized care recommendations</li>
                  <li>General care guides for different product categories are available in our blog section</li>
                </ul>
                <p>Following the recommended care instructions will help maintain the quality and extend the life of your purchases.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="bg-gray-100 p-6 rounded-lg mt-12">
          <h2 className="text-xl font-serif font-medium mb-4">Still Have Questions?</h2>
          <p className="mb-4">
            If you couldn't find the answer to your question, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-black hover:bg-[#D4AF37] text-white" asChild>
              <Link href="/info/contact">Contact Customer Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/info/shipping-returns">View Shipping & Returns Policy</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQsPage;