import PageLayout from "@/components/ui/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, Heart, MapPin, Clock, Award } from "lucide-react";

const CareersPage = () => {
  const openPositions = [
    {
      title: "Senior Fashion Buyer",
      department: "Merchandising",
      location: "Port Harcourt",
      type: "Full-time",
      description: "We're seeking an experienced fashion buyer with a passion for luxury brands to join our merchandising team. You'll be responsible for sourcing and selecting high-end products that align with our brand vision and customer preferences.",
    },
    {
      title: "E-commerce Manager",
      department: "Digital",
      location: "Port Harcourt",
      type: "Full-time",
      description: "Lead our online retail strategy to drive growth and enhance the customer experience. You'll oversee website development, digital marketing initiatives, and online sales performance.",
    },
    {
      title: "Visual Merchandiser",
      department: "Retail Operations",
      location: "Lagos",
      type: "Full-time",
      description: "Create visually stunning displays that showcase our luxury products and enhance the in-store customer experience. You'll work closely with the retail and marketing teams to bring our brand identity to life.",
    },
    {
      title: "Customer Experience Specialist",
      department: "Customer Service",
      location: "Remote (Nigeria)",
      type: "Full-time",
      description: "Provide exceptional service to our customers across all touchpoints. You'll handle inquiries, resolve issues, and ensure that every customer interaction reflects our commitment to excellence.",
    },
    {
      title: "Inventory Coordinator",
      department: "Operations",
      location: "Port Harcourt",
      type: "Full-time",
      description: "Oversee inventory management across our physical and online stores. You'll work with multiple teams to ensure efficient stock levels, process shipments, and maintain accurate inventory records.",
    },
    {
      title: "Social Media Content Creator",
      department: "Marketing",
      location: "Lagos/Remote",
      type: "Part-time",
      description: "Create engaging content for our social media platforms that highlights our products and resonates with our target audience. You'll help build our brand presence and drive customer engagement online.",
    }
  ];

  return (
    <PageLayout title="Careers at DASH">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <p className="mb-8 text-lg">
            Join our team of passionate professionals dedicated to delivering exceptional luxury fashion experiences. 
            At DASH, we're always looking for talented individuals who share our commitment to quality, 
            creativity, and customer satisfaction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Grow With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  As one of Nigeria's leading luxury fashion retailers, DASH offers exceptional opportunities 
                  for career growth and professional development. We invest in our team members and provide 
                  clear pathways for advancement.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Users className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Collaborative Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We foster a collaborative environment where teamwork, creativity, and innovation are valued. 
                  Our diverse team brings together unique perspectives and talents to create extraordinary 
                  experiences for our customers.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Award className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Industry Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Working at DASH means being at the forefront of the luxury fashion industry in Africa. 
                  You'll have the opportunity to work with world-renowned brands and contribute to setting 
                  new standards in retail excellence.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Heart className="h-8 w-8 text-[#D4AF37]" />
                <CardTitle>Meaningful Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We value our team members and offer competitive compensation, comprehensive health benefits, 
                  employee discounts, training opportunities, and a supportive work environment that promotes 
                  well-being and work-life balance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Open Positions</h2>
          
          <div className="space-y-6 mb-8">
            {openPositions.map((position, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{position.title}</h3>
                    <p className="text-[#D4AF37]">{position.department}</p>
                  </div>
                  <Button className="bg-black hover:bg-[#D4AF37] text-white">Apply Now</Button>
                </div>
                
                <p className="text-gray-700 mb-4">{position.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {position.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {position.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Don't see a position that matches your skills?</h3>
            <p className="text-gray-700 mb-4">
              We're always interested in connecting with talented individuals who are passionate about luxury fashion. 
              Send your resume to careers@dashng.com with a cover letter explaining why you'd be a great fit for our team.
            </p>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Our Hiring Process</h2>
          
          <div className="space-y-8">
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium mb-2">Application Review</h3>
                <p className="text-gray-700">
                  Our HR team carefully reviews all applications to identify candidates whose skills, 
                  experience, and values align with our needs and company culture.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium mb-2">Initial Interview</h3>
                <p className="text-gray-700">
                  Selected candidates are invited for an initial interview, which may be conducted virtually 
                  or in person. This conversation focuses on your background, experience, and potential fit 
                  with our team.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium mb-2">Skills Assessment</h3>
                <p className="text-gray-700">
                  Depending on the role, you may be asked to complete a skills assessment, case study, 
                  or practical exercise to demonstrate your expertise and approach to real-world challenges.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium mb-2">Final Interview</h3>
                <p className="text-gray-700">
                  Final candidates meet with senior team members and potential colleagues for a more 
                  in-depth discussion about the role, team dynamics, and future growth opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium mb-2">Offer & Onboarding</h3>
                <p className="text-gray-700">
                  Successful candidates receive a formal offer and, upon acceptance, 
                  begin our comprehensive onboarding process designed to set you up for success at DASH.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-serif font-medium mb-6">Life at DASH</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Team Photo</span>
            </div>
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Store Interior</span>
            </div>
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Team Event</span>
            </div>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-start mb-6">
              <div className="mr-4 mt-1">
                <img 
                  src="https://i.pravatar.cc/100?img=5" 
                  alt="Employee portrait" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Adaeze Okonkwo</h3>
                <p className="text-[#D4AF37] text-sm mb-2">Senior Merchandiser, 3 years at DASH</p>
                <p className="text-gray-700 italic">
                  "Working at DASH has been a transformative experience for my career. The collaborative culture, 
                  focus on professional development, and opportunity to work with world-class brands has helped 
                  me grow both personally and professionally. Each day brings new challenges and opportunities to learn."
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <img 
                  src="https://i.pravatar.cc/100?img=12" 
                  alt="Employee portrait" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Oluwaseun Adeyemi</h3>
                <p className="text-[#D4AF37] text-sm mb-2">Digital Marketing Manager, 2 years at DASH</p>
                <p className="text-gray-700 italic">
                  "DASH is more than just a luxury retailer—it's a place where innovation and creativity are valued. 
                  I've been empowered to implement new digital strategies that have significantly impacted our brand presence 
                  and customer engagement. The supportive leadership team truly believes in developing their employees."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Ready to Join Our Team?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Explore our current openings and take the first step toward a rewarding career at DASH. 
            We look forward to learning more about you and the unique perspective you can bring to our team.
          </p>
          <Button className="bg-black hover:bg-[#D4AF37] text-white">
            View All Positions
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;