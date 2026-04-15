import HeroSection from '../HeroSection';
import Informations from '../Information';
import Features from '../Features';
import Information from '../FrequentlyAsk';
import Header from '../Header';
import Footer from '..//Footer';

function HomePage() {
  return (
    <>
       <Header/>
      <HeroSection />
      <Informations />
      <Features />
      <Information />
      <Footer/>
    </>
  );
}

export default HomePage;