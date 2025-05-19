import { Link } from "wouter";
import Container from "@/components/ui/Container";

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    title: "Women's Clothing",
    image: "https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    link: "/women/clothing"
  },
  {
    id: 2,
    title: "Men's Clothing",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    link: "/men/clothing"
  },
  {
    id: 3,
    title: "Luxury Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    link: "/bags"
  },
  {
    id: 4,
    title: "Jewelry & Accessories",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    link: "/jewelry"
  },
];

const Categories = () => {
  return (
    <section className="py-16">
      <Container>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-12">Shop By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map(category => (
            <div key={category.id} className="relative group overflow-hidden">
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-lg md:text-xl font-medium">{category.title}</h3>
                  <Link href={category.link}>
                    <span className="inline-block mt-2 text-white text-sm border-b border-white pb-1 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors cursor-pointer">
                      Shop Now
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
