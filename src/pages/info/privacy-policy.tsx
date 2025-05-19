import PageLayout from "@/components/ui/PageLayout";

const PrivacyPolicyPage = () => {
  const lastUpdated = "April 15, 2025";

  return (
    <PageLayout title="Privacy Policy">
      <p className="mb-4 text-gray-600">Last Updated: {lastUpdated}</p>
      
      <p className="mb-6">
        At DASH, we are committed to protecting your privacy and ensuring the security of your personal information. 
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
        or make purchases from our store. Please read this policy carefully to understand our practices regarding your personal data.
      </p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Information We Collect</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Personal Information</h3>
          <p className="mb-2">We may collect the following types of personal information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contact information (name, email address, phone number, shipping and billing address)</li>
            <li>Account information (username, password)</li>
            <li>Payment information (credit card details, banking information)</li>
            <li>Purchase history and preferences</li>
            <li>Communications with our customer service team</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
          <p className="mb-2">When you visit our website, we may automatically collect certain information, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address and device identifiers</li>
            <li>Browser type and settings</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Browsing activity and interactions with our website</li>
            <li>Location information</li>
          </ul>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">How We Use Your Information</h2>
        <p className="mb-2">We use the information we collect for various purposes, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Processing Transactions:</strong> To complete purchases, process payments, arrange for shipping, and provide customer service.
          </li>
          <li>
            <strong>Account Management:</strong> To create and manage your account, authenticate your identity, and maintain the security of your account.
          </li>
          <li>
            <strong>Customer Service:</strong> To respond to your inquiries, provide support, and address any issues or concerns.
          </li>
          <li>
            <strong>Marketing and Communications:</strong> To send promotional materials, newsletters, and updates about our products and services (with your consent where required by law).
          </li>
          <li>
            <strong>Improving Our Services:</strong> To analyze usage patterns, conduct research, and improve our website, products, and services.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.
          </li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Information Sharing and Disclosure</h2>
        <p className="mb-2">We may share your information with third parties in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Service Providers:</strong> With third-party service providers who perform services on our behalf, such as payment processing, shipping, customer service, and marketing.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of all or a portion of our business or assets.
          </li>
          <li>
            <strong>Legal Compliance:</strong> When required by law, regulation, or legal process, or to protect our rights, property, or safety.
          </li>
          <li>
            <strong>With Your Consent:</strong> In other cases where we have your explicit consent to share your information.
          </li>
        </ul>
        <p className="mt-4">
          We do not sell, rent, or lease your personal information to third parties for their marketing purposes without your explicit consent.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, 
          disclosure, alteration, or destruction. These measures include encryption, secure socket layer technology (SSL), 
          and regular security assessments.
        </p>
        <p>
          However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially 
          acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Your Rights and Choices</h2>
        <p className="mb-2">Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Access and Portability:</strong> You may request access to the personal information we hold about you and, in some cases, request a copy in a structured, commonly used, and machine-readable format.
          </li>
          <li>
            <strong>Correction:</strong> You may request that we correct inaccurate or incomplete information about you.
          </li>
          <li>
            <strong>Deletion:</strong> You may request that we delete your personal information in certain circumstances.
          </li>
          <li>
            <strong>Restriction and Objection:</strong> You may request that we restrict the processing of your information or object to certain processing activities.
          </li>
          <li>
            <strong>Consent Withdrawal:</strong> Where we process your information based on your consent, you have the right to withdraw that consent at any time.
          </li>
        </ul>
        <p className="mt-4">
          To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to collect information about your browsing activities on our website. 
          Cookies are small data files that are placed on your device when you visit a website. They allow us to recognize your 
          browser and capture certain information.
        </p>
        <p className="mb-4">
          We use cookies for various purposes, including:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Remembering your preferences and settings</li>
          <li>Keeping you logged in to your account</li>
          <li>Understanding how you use our website</li>
          <li>Personalizing your experience</li>
          <li>Measuring the effectiveness of our marketing campaigns</li>
        </ul>
        <p className="mt-4">
          You can manage your cookie preferences through your browser settings. Most browsers allow you to refuse or accept cookies 
          and to delete them. However, if you disable cookies, some features of our website may not function properly.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Children's Privacy</h2>
        <p>
          Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal 
          information from children. If you are a parent or guardian and believe that your child has provided us with personal 
          information, please contact us, and we will take steps to delete such information.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-serif font-medium mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
          We will notify you of any material changes by posting the updated Privacy Policy on our website and updating the 
          "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-serif font-medium mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, 
          please contact us at:
        </p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>DASH NG</p>
          <p>1 Brooks Stone Close, GRA</p>
          <p>Port Harcourt, Rivers, Nigeria</p>
          <p>Email: privacy@dashng.com</p>
          <p>Phone: +234 123 456 7890</p>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;