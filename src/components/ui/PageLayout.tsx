import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <Container>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8">{title}</h1>
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;