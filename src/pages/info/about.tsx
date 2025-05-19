import PageLayout from "@/components/ui/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

const AboutPage = () => {
  const coreValues = [
    {
      title: "Excellence",
      description: "We are committed to delivering exceptional quality in our products, services, and customer experiences. We constantly raise the bar and challenge ourselves to exceed expectations.",
    },
    {
      title: "Authenticity",
      description: "We value genuine relationships with our customers, partners, and team members. We are transparent in our business practices and offer only authentic luxury products.",
    },
    {
      title: "Innovation",
      description: "We embrace change and continuously seek new ways to enhance the luxury retail experience. We stay ahead of trends and leverage technology to bring fashion forward.",
    },
    {
      title: "Inclusion",
      description: "We celebrate diversity and create an inclusive environment that welcomes all. We believe that different perspectives drive creativity and better outcomes.",
    },
    {
      title: "Sustainability",
      description: "We are committed to responsible practices that minimize our environmental impact. We work with brands that share our commitment to sustainable and ethical fashion.",
    }
  ];

  return (
    <PageLayout title="About DASH">
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Story</h2>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="mb-4">
                Founded in 2020, DASH emerged from a vision to transform the luxury fashion landscape in Nigeria. 
                Our founder, Emmanuel Uwaifo, saw an opportunity to bring the world's most coveted fashion brands 
                to discerning Nigerian consumers who previously had limited access to authentic luxury goods.
              </p>
              <p>
                What began as a small boutique in Port Harcourt has evolved into Nigeria's premier destination 
                for luxury fashion, offering a curated selection of clothing, accessories, and jewelry from 
                internationally renowned designers and emerging local talent.
              </p>
            </div>
            
            <div className="bg-gray-200 aspect-video flex items-center justify-center">
              <span className="text-gray-500">Founder Image</span>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="mb-4">
              Over the years, we've built a reputation for exceptional service, product authenticity, and a 
              shopping experience that rivals luxury retailers around the world. Our growth has been driven by 
              our unwavering commitment to our customers and our passion for fashion.
            </p>
            <p>
              Today, DASH operates both online and through our flagship store in Port Harcourt, with expansion 
              plans for Lagos and Abuja. We continue to evolve, bringing innovative shopping experiences to our 
              customers while remaining true to our founding vision of making luxury fashion accessible to 
              Nigerian consumers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-4xl font-serif mb-2 text-[#D4AF37]">150+</h3>
              <p className="text-gray-700">Global luxury brands</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-4xl font-serif mb-2 text-[#D4AF37]">20,000+</h3>
              <p className="text-gray-700">Happy customers</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-4xl font-serif mb-2 text-[#D4AF37]">5+</h3>
              <p className="text-gray-700">Years of excellence</p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Mission & Vision</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F9F6EE] p-8 rounded-lg border border-[#D4AF37]">
              <h3 className="text-xl font-medium mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To provide Nigerian consumers with access to authentic luxury fashion products and exceptional 
                shopping experiences that celebrate style, quality, and individual expression.
              </p>
            </div>
            
            <div className="bg-[#F9F6EE] p-8 rounded-lg border border-[#D4AF37]">
              <h3 className="text-xl font-medium mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the leading luxury fashion destination in Africa, recognized for our curated selection, 
                impeccable service, and commitment to innovation in the retail experience.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="flex">
                <div className="mt-1 mr-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Team</h2>
          
          <p className="mb-8">
            At DASH, our success is driven by our talented team of fashion enthusiasts, retail experts, 
            and customer service professionals. Together, we work to deliver exceptional experiences and 
            bring our vision to life.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-gray-200 aspect-square rounded-full w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <h3 className="font-medium">Emmanuel Uwaifo</h3>
              <p className="text-[#D4AF37]">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 aspect-square rounded-full w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <h3 className="font-medium">Chioma Okafor</h3>
              <p className="text-[#D4AF37]">Chief Operating Officer</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 aspect-square rounded-full w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <h3 className="font-medium">David Adegoke</h3>
              <p className="text-[#D4AF37]">Creative Director</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button className="bg-black hover:bg-[#D4AF37] text-white" asChild>
              <Link href="/info/careers">Join Our Team</Link>
            </Button>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Store</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <p className="mb-4">
                Our flagship store in Port Harcourt is more than just a retail space—it's an immersive luxury experience. 
                Designed with attention to every detail, the store showcases our carefully curated collections in an 
                elegant environment that reflects the quality and craftsmanship of the products we offer.
              </p>
              <p>
                We invite you to visit us and experience the DASH difference in person. Our knowledgeable stylists 
                are available to provide personalized shopping assistance and help you discover pieces that elevate 
                your personal style.
              </p>
            </div>
            
            <div className="bg-gray-200 aspect-video flex items-center justify-center">
              <span className="text-gray-500">Store Interior Image</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Visit Us</h3>
            <p className="mb-1"><strong>Address:</strong> 1 Brooks Stone Close, GRA, Port Harcourt, Rivers, Nigeria</p>
            <p className="mb-1"><strong>Hours:</strong> Monday - Friday: 9am - 6pm | Saturday: 10am - 4pm | Sunday: Closed</p>
            <p><strong>Contact:</strong> +234 123 456 7890 | hello@dashng.com</p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-serif font-medium mb-6">Our Commitment to Sustainability</h2>
          
          <p className="mb-6">
            At DASH, we believe that luxury and sustainability can—and should—coexist. We are committed to 
            responsible business practices and work with brands that share our values regarding ethical 
            production, fair labor practices, and environmental stewardship.
          </p>
          
          <div className="flex justify-center mb-8">
            <Button className="bg-black hover:bg-[#D4AF37] text-white" asChild>
              <Link href="/info/sustainability">Learn More About Our Sustainability Efforts</Link>
            </Button>
          </div>
          
          <div className="bg-[#F9F6EE] p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-4">Get to Know Us Better</h3>
            <p className="mb-6">
              Discover more about DASH by exploring our website, visiting our store, or connecting with us on social media. 
              We look forward to sharing our passion for luxury fashion with you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/info/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Explore Our Collections</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/info/careers">Join Our Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AboutPage;