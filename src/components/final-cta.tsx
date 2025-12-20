"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           viewport={{ once: true }}
           className="glass-card max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] relative overflow-hidden group border border-primary/20"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 tracking-tight relative z-10">
            Ready to Modernize <br className="hidden md:block" />
            <span className="text-gradient">Your Campus?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
            Join the digital revolution in campus management. Start your journey with ZenCampus today and empower your community.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              href="https://zencampusapp.netlify.app/login"
              target="_blank"
              className="px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started Now <FaArrowRight />
            </Link>
            <Link
              href="#pricing"
              className="px-10 py-5 glass text-foreground rounded-full font-bold text-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
