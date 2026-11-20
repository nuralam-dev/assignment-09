import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import Banner from "@/components/shared/Banner";
import OurServices from "@/components/services/OurServices";

const HomePage = () => {
  return (
    <div>
      <Banner></Banner>
      <OurServices />
      <WhyChooseUs />
      <CustomerReviews />
    </div>
  );
};

export default HomePage;
