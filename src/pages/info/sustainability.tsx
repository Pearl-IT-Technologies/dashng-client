import PageLayout from "@/components/ui/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, ShieldCheck, HeartHandshake } from "lucide-react";

const SustainabilityPage = () => {
  return (
    <PageLayout title="Our Commitment to Sustainability">
      <p className="mb-8">
        At DASH, we believe that luxury and sustainability can—and should—coexist. We are committed to 
        making responsible choices in our business practices, from the products we select to the way we 
        operate our store. Our sustainability journey is ongoing, and we're constantly seeking ways to 
        reduce our environmental impact while supporting ethical practices in the fashion industry.
      </p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Our Sustainability Pillars</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Leaf className="h-8 w-8 text-[#D4AF37]" />
              <div>
                <CardTitle>Environmental Responsibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We're committed to reducing our environmental footprint by implementing eco-friendly 
                practices in our operations, from energy-efficient lighting in our store to minimizing 
                waste in our packaging and shipping processes.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
              <div>
                <CardTitle>Ethical Sourcing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We carefully select brands and products that align with our values, prioritizing those 
                that demonstrate ethical manufacturing practices, fair labor standards, and transparency 
                in their supply chains.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Recycle className="h-8 w-8 text-[#D4AF37]" />
              <div>
                <CardTitle>Circular Fashion</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We promote the principles of circular fashion by offering products designed for longevity 
                and encouraging our customers to invest in timeless pieces that transcend seasonal trends.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <HeartHandshake className="h-8 w-8 text-[#D4AF37]" />
              <div>
                <CardTitle>Community Engagement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We believe in giving back to our community through partnerships with local organizations 
                and initiatives that support sustainable development and ethical practices in Nigeria.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Our Sustainable Practices</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-3">Eco-Friendly Operations</h3>
            <p className="mb-4">
              We've implemented various measures to reduce the environmental impact of our physical store and online operations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Energy-efficient LED lighting throughout our store</li>
              <li>Digital receipts to reduce paper waste</li>
              <li>Reusable shopping bags made from recycled materials</li>
              <li>Water conservation measures in our facilities</li>
              <li>Carbon-offset shipping options for online orders</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Sustainable Packaging</h3>
            <p className="mb-4">
              We're committed to minimizing waste through thoughtful packaging choices:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Plastic-free packaging made from recycled and biodegradable materials</li>
              <li>Reusable and recyclable shipping boxes and mailers</li>
              <li>Minimal packaging design that reduces material usage without compromising protection</li>
              <li>Tissue paper made from recycled content and printed with soy-based inks</li>
              <li>Packaging tape made from paper rather than plastic</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Curated Brand Selection</h3>
            <p className="mb-4">
              We partner with brands that share our commitment to sustainability:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Brands that use eco-friendly materials such as organic cotton, recycled fibers, and vegetable-tanned leather</li>
              <li>Companies with transparent supply chains and ethical labor practices</li>
              <li>Designers who prioritize quality and longevity over fast fashion</li>
              <li>Local Nigerian artisans and craftspeople who preserve traditional techniques</li>
              <li>Brands with programs for recycling or upcycling their products</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Our Sustainability Goals</h2>
        
        <p className="mb-6">
          While we're proud of the steps we've taken, we recognize that sustainability is a journey of continuous improvement. 
          Here are some of our key goals for the coming years:
        </p>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-medium mb-4">2025 Goals</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reduce overall carbon footprint by 30%</li>
            <li>Achieve 100% plastic-free packaging</li>
            <li>Increase our offering of sustainable and ethically-produced products to 60% of our inventory</li>
            <li>Implement a garment take-back program for proper recycling or donation</li>
          </ul>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">2030 Goals</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Achieve carbon neutrality across all operations</li>
            <li>Source 100% of our energy from renewable sources</li>
            <li>Ensure all brands we carry meet stringent sustainability and ethical standards</li>
            <li>Establish a DASH Foundation to support environmental conservation and ethical fashion initiatives in Nigeria</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-serif font-medium mb-6">Join Us on Our Sustainability Journey</h2>
        
        <p className="mb-4">
          We believe that meaningful change requires collaboration. Here's how you can join us in promoting sustainability:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Invest in quality pieces that are designed to last</li>
          <li>Care for your garments properly to extend their lifespan</li>
          <li>Consider repair or alteration before replacement</li>
          <li>Donate or resell items you no longer wear</li>
          <li>Choose carbon-offset shipping options when available</li>
          <li>Bring your own shopping bag when visiting our store</li>
        </ul>
        
        <p>
          We welcome your feedback and suggestions on how we can further improve our sustainability practices. 
          Please contact us at sustainability@dashng.com to share your ideas or learn more about our initiatives.
        </p>
      </section>
    </PageLayout>
  );
};

export default SustainabilityPage;