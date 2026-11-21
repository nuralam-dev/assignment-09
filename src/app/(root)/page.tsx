import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import Banner from "@/components/shared/Banner";
import OurServices from "@/components/services/OurServices";
import HowFixMateWorks from "@/components/home/HowFixMateWorks";
import AboutFixMate from "@/components/home/AboutFixMate";
import "@/components/home/home-sections.css";

const HomePage = () => {
  return (
    <div>
      <Banner></Banner>
      <OurServices />
      <HowFixMateWorks />
      <AboutFixMate />
      <WhyChooseUs />
      <CustomerReviews />
    </div>
  );
};

export default HomePage;
