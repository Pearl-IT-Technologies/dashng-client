import PageLayout from "@/components/ui/PageLayout";

const TermsPage = () => {
  const lastUpdated = "April 15, 2025";

  return (
    <PageLayout title="Terms & Conditions">
      <p className="mb-4 text-gray-600">Last Updated: {lastUpdated}</p>
      
      <p className="mb-6">
        Welcome to DASH. These Terms and Conditions ("Terms") govern your use of the DASH website and mobile application (collectively, the "Platform") 
        and your purchase and use of products and services offered by DASH. By accessing the Platform or making a purchase, you agree to be bound by these Terms. 
        Please read them carefully.
      </p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, 
          as well as our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, you must not access or use the Platform.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">2. Account Registration</h2>
        <p className="mb-4">
          To access certain features of the Platform or make purchases, you may need to create an account. When registering for an account, 
          you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your 
          account credentials and for all activities that occur under your account.
        </p>
        <p>
          You agree to immediately notify DASH of any unauthorized use of your account or any other breach of security. 
          DASH will not be liable for any loss or damage arising from your failure to protect your account credentials.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">3. Products and Orders</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">3.1 Product Information</h3>
          <p>
            DASH makes every effort to display products accurately, including their colors, dimensions, and features. 
            However, the actual colors and details you see depend on your monitor, and we cannot guarantee that your display will accurately reflect the actual products.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">3.2 Availability and Pricing</h3>
          <p>
            All products are subject to availability. We reserve the right to limit quantities, discontinue products, 
            or modify specifications without notice. Prices for products are subject to change without notice. All prices are displayed in Nigerian Naira (₦) 
            unless otherwise indicated.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">3.3 Order Acceptance</h3>
          <p>
            Your order constitutes an offer to purchase. DASH reserves the right to accept or decline your order for any reason, 
            including product unavailability, errors in product or pricing information, or problems with your account or payment method.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">3.4 Payment</h3>
          <p>
            By providing payment information, you represent and warrant that you have the legal right to use the payment method provided. 
            You authorize DASH to charge the full purchase amount to the payment method you provide. All payments are processed securely through our payment partners.
          </p>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">4. Shipping and Delivery</h2>
        <p className="mb-4">
          DASH offers various shipping options, as described in our Shipping & Returns policy. Delivery times are estimates and not guaranteed. 
          Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
        </p>
        <p>
          DASH is not responsible for delays in delivery due to customs processing, adverse weather conditions, or other circumstances beyond our control.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">5. Returns and Exchanges</h2>
        <p>
          Our return and exchange policies are detailed in our Shipping & Returns policy. By making a purchase, 
          you agree to abide by these policies. All returns and exchanges are subject to the conditions and timeframes specified therein.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">6. Intellectual Property</h2>
        <p className="mb-4">
          All content on the Platform, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, 
          is the property of DASH or its content suppliers and is protected by Nigerian and international copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, 
          decompile, or otherwise exploit the Platform or any portion of it without DASH's explicit written consent.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">7. User Content</h2>
        <p className="mb-4">
          When you submit reviews, comments, or other content to the Platform, you grant DASH a non-exclusive, royalty-free, perpetual, irrevocable, 
          and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display 
          such content throughout the world in any media.
        </p>
        <p>
          You represent and warrant that you own or control all rights to the content you submit, that the content is accurate, 
          and that use of the content does not violate these Terms or any law or regulation.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">8. Disclaimer of Warranties</h2>
        <p className="mb-4">
          THE PLATFORM AND ALL PRODUCTS AND SERVICES OFFERED BY DASH ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, 
          WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          DASH DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, 
          OR THAT THE PLATFORM OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">9. Limitation of Liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, DASH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
          INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR ACCESS TO OR USE OF, 
          OR INABILITY TO ACCESS OR USE, THE PLATFORM OR ANY PRODUCTS OR SERVICES.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless DASH, its officers, directors, employees, agents, licensors, and suppliers from and against all losses, 
          expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these Terms or any activity related to your account.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, 
          without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms shall be subject to the exclusive 
          jurisdiction of the courts of Nigeria.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">12. Changes to Terms</h2>
        <p>
          DASH reserves the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on the Platform 
          and updating the "Last Updated" date. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-serif font-medium mb-4">13. Contact Information</h2>
        <p className="mb-4">
          If you have any questions or concerns about these Terms, please contact us at:
        </p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>DASH NG</p>
          <p>1 Brooks Stone Close, GRA</p>
          <p>Port Harcourt, Rivers, Nigeria</p>
          <p>Email: legal@dashng.com</p>
          <p>Phone: +234 123 456 7890</p>
        </div>
      </section>
    </PageLayout>
  );
};

export default TermsPage;