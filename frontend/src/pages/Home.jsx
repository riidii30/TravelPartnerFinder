import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import DestinationCards from "../components/DestinationCards";
import WhyTravelMate from "../components/WhyTravelMate";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <DestinationCards />
      <WhyTravelMate />
    </MainLayout>
  );
}

export default Home;