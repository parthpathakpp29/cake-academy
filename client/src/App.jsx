import React from 'react';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCourses from './components/FeaturedCourses';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <Navbar />
          <Hero />
          <FeaturedCourses />
          <WhyChooseUs />
          <Testimonials />
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
