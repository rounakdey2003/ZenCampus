"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";

const faqs = [
  {
    question: "How long does it take to deploy ZenCampus?",
    answer: "A typical deployment takes 2-4 weeks, depending on the number of modules chosen and the size of your institution. Our team handles the initial data setup and staff training."
  },
  {
    question: "Can we start with just one module?",
    answer: "Yes! ZenCampus is completely modular. You can start with ZenLaundry or ZenCanteen and add more modules as your needs grow."
  },
  {
    question: "Is student data secure?",
    answer: "Absolutely. We use industry-standard encryption and role-based access control. All data is hosted on secure, compliant cloud servers with regular backups."
  },
  {
    question: "Do you offer on-premise installation?",
    answer: "On-premise deployment is available exclusively for our Enterprise plan customers who require dedicated infrastructure."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">
            Common Questions
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need <span className="text-gradient">to Know</span>
          </h3>
          <p className="text-muted-foreground text-lg">
            Find answers to the most frequently asked questions about ZenCampus.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="glass rounded-2xl overflow-hidden border border-border/40"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-foreground">{faq.question}</span>
                <FaChevronDown 
                  className={`text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
