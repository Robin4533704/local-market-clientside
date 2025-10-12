import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Where does your produce come from?",
      answer: "All of our fruits, vegetables, and pantry items are grown or made right here on our family farm. When needed, we may partner with trusted nearby farms that follow the same organic and sustainable practices.",
    },
    {
      question: "Is everything you sell certified organic?",
      answer: "Yes, we ensure that all our products are certified organic, adhering to strict standards to provide you with the best quality.",
    },
    {
      question: "How does the subscription box work?",
      answer: "Our subscription box delivers fresh, seasonal produce directly to your door on a weekly basis. Customize your box and enjoy farm-fresh goods all year round.",
    },
    {
      question: "Where do you deliver?",
      answer: "We deliver within a 50-mile radius of our farm. Specific delivery zones and details are available upon order confirmation.",
    },
    {
      question: "Is your packaging eco-friendly?",
      answer: "Absolutely! We use biodegradable and recyclable packaging materials to reduce our environmental impact.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4 } },
  };

  return (
    <div className='bg-red-100 p-8'>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <p className="mb-8 text-center text-gray-700">Everything you need to know about shopping with us.</p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg bg-red-100 shadow-md overflow-hidden">
              <button
                className="w-full px-4 py-3 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-left bg-lime-400 px-2 rounded">{faq.question}</span>
                <motion.svg
                  className="w-5 h-5 bg-amber-300 rounded-xl transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    className="px-4 pb-4 bg-blue-100 text-gray-700"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={answerVariants}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition duration-300"
          >
            View All FAQs
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link 
              to='/contactus' 
              className="border border-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 hover:text-white transition duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
