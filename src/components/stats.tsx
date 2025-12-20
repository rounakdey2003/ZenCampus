"use client";

import { motion } from "framer-motion";

export function Stats() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "100%", label: "Paperless Workflow" },
            { value: "24/7", label: "System Availability" },
            { value: "Fast", label: "Next.js Performance" },
            { value: "Secure", label: "Role-Based Access" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 border-r border-primary-foreground/20 last:border-0"
            >
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-primary-foreground/80 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
