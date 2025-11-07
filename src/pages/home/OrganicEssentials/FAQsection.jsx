import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Where does your produce come from?",
      answer: "All of our fruits, vegetables, and pantry items are grown or made right here on our family farm. When needed, we may partner with trusted nearby farms that follow the same organic and sustainable practices.",
      icon: "🌱"
    },
    {
      question: "Is everything you sell certified organic?",
      answer: "Yes, we ensure that all our products are certified organic, adhering to strict standards to provide you with the best quality. Our certification guarantees no synthetic pesticides, GMOs, or harmful chemicals.",
      icon: "✅"
    },
    {
      question: "How does the subscription box work?",
      answer: "Our subscription box delivers fresh, seasonal produce directly to your door on a weekly basis. You can customize your preferences, skip weeks when needed, and cancel anytime. Each box comes with recipe cards and farm stories.",
      icon: "📦"
    },
    {
      question: "Where do you deliver?",
      answer: "We deliver within a 50-mile radius of our farm. Specific delivery zones and details are available upon order confirmation. We're constantly expanding our delivery areas to serve more communities.",
      icon: "🚚"
    },
    {
      question: "Is your packaging eco-friendly?",
      answer: "Absolutely! We use 100% biodegradable and recyclable packaging materials to reduce our environmental impact. Our boxes are compostable, and we minimize plastic use throughout our supply chain.",
      icon: "♻️"
    },
    {
      question: "Can I customize my order?",
      answer: "Yes! You can customize your weekly box based on seasonal availability. Our platform allows you to set preferences, swap items, and add special requests to tailor your delivery to your family's needs.",
      icon: "⚙️"
    }
  ];

  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const answerVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full mb-6 border border-green-200"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold uppercase tracking-wider">FAQ</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our organic farm, delivery service, and how to get the freshest produce to your table.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 transition-all duration-500 overflow-hidden ${
                  openIndex === index 
                    ? 'border-green-500 shadow-green-100' 
                    : 'border-gray-100 hover:border-green-300'
                }`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                
                {/* Question Button */}
                <motion.button
                  className="w-full px-6 py-6 flex items-start justify-between gap-4 text-left focus:outline-none focus:ring-4 focus:ring-green-200 rounded-2xl"
                  onClick={() => toggleFAQ(index)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        openIndex === index 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white'
                      } transition-colors duration-300`}
                    >
                      {faq.icon}
                    </motion.div>
                    
                    {/* Question Text */}
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                        openIndex === index ? 'text-green-700' : 'text-gray-800 group-hover:text-green-700'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Animated Chevron */}
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <svg 
                      className={`w-5 h-5 transition-colors duration-300 ${
                        openIndex === index ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>

                {/* Answer Section */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={answerVariants}
                    >
                      <div className="px-6 pb-6 ml-16 border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-green-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Please reach out to our friendly team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden relative"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-3">
                View All FAQs
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to='/contactus' 
                className="inline-flex items-center gap-3 border-2 border-green-500 text-green-700 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <span>Contact Us</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💬
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;