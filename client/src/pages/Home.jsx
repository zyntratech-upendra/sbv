import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeHero from "../components/HomeHero";
import HomeStats from "../components/HomeStats";
import HomeFeatures from "../components/HomeFeatures";
import HomeWorkflow from "../components/HomeWorkflow";
import HomeModules from "../components/HomeModules";
import HomeWhyChoose from "../components/HomeWhyChoose";
import HomeCTA from "../components/HomeCTA";

const Home = () => {
  return (
    <>
    <Navbar/>
    <HomeHero/>
   
    <HomeFeatures/>
    <HomeWorkflow/>
    <HomeModules/>
     <HomeStats/>
     <HomeCTA/>
    <Footer/>
    </>
  );
};

export default Home;
