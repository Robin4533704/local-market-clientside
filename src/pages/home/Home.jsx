import React from 'react';
import Banner from './banner/Banner';
import Services from './services/Services';
import ShopCategorie from './ShopCategories/ShopCategorie';
import OrganicEssentials from './OrganicEssentials/OrganicEssentials';
import Works from './OrganicEssentials/Works';
import OrganicFarmSection from './OrganicEssentials/OrganicFarmSection';
import FAQSection from './OrganicEssentials/FAQsection';
import Farmers from './Farmers';
import LogoMarquee from './LogoMarquee';

const Home = () => {
    return (
        <div>
           <Banner/>
           <Services/>
           <ShopCategorie/>
           <OrganicEssentials/>
           <Works/>
           
           <OrganicFarmSection/>
<LogoMarquee/>
           <FAQSection/>
           <Farmers/>
           

        </div>
    );
};

export default Home;