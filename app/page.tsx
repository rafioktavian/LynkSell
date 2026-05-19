import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
