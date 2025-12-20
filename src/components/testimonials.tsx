"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa6";

const testimonials = [
  {
    name: "Dr. Arvind Kumar",
    role: "Director, IIT Tech",
    content: "ZenCampus has completely transformed how we manage our student facilities. The ZenFix module alone reduced our maintenance response time by 60%.",
    stars: 5,
    avatar: "A"
  },
  {
    name: "Sneha Reddy",
    role: "President, Student Council",
    content: "The Canteen pre-ordering and Laundry tracking have made daily life so much easier for students. No more long queues!",
    stars: 5,
    avatar: "S"
  },
  {
    name: "Prof. Michael Chen",
    role: "Administrative Head",
    content: "A truly unified ecosystem. Having academic notices and facility management in one dashboard is a game changer for university administration.",
    stars: 5,
    avatar: "M"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">
            Social Proof
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading <span className="text-gradient">Institutions</span>
          </h3>
          <p className="text-muted-foreground text-lg">
            Hear from the administrators and students who use ZenCampus every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl relative group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaQuoteLeft className="text-xl" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-sm" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-8 italic">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
