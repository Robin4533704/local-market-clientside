import React from 'react';
import Banner from './banner/Banner';
import Services from './services/Services';
import ShopCategorie from './ShopCategories/ShopCategorie';
import OrganicEssentials from './OrganicEssentials/OrganicEssentials';
import Works from './OrganicEssentials/Works';
import OrganicFarmSection from './OrganicEssentials/OrganicFarmSection';
import FAQSection from './OrganicEssentials/FAQsection';

import LogoMarquee from './LogoMarquee';
import PublicData from '../dashbord/pandingdelivery/ProductList/PublicData';

const Home = () => {
    return (
        <div>
           <Banner/>
           <Services/>
         <div className='pb-2 pt-10 bg-[#f5deb3]'>
              <PublicData/>
         </div>
           <OrganicEssentials/>
           <Works/>
           
           <OrganicFarmSection/>
<LogoMarquee/>
           <FAQSection/>
          
           

        </div>
    );
};

export default Home;