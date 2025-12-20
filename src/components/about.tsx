"use client";

import { FaGraduationCap } from "react-icons/fa6";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 bg-background border-t border-border">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Why ZenCampus?
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Managing a campus involves hundreds of moving parts—from feeding
          students to maintaining facilities. Traditional paper-based or
          disjointed digital systems lead to confusion and delay.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          ZenCampus unifies these accommodation and student-life workflows into
          a single, intuitive platform. We empower students to take control of
          their daily needs and give administrators the oversight they need to
          run efficient institutions.
        </p>
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <FaGraduationCap className="text-4xl text-primary" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
