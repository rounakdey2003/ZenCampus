"use client";

import {
  FaUtensils,
  FaJugDetergent,
  FaScrewdriverWrench,
  FaComments,
  FaBullhorn,
  FaChartPie,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Smart Canteen",
    description:
      "Browse daily menus, place orders online, and track meal status in real-time. Reduces queues and food waste.",
    icon: FaUtensils,
    colorClass: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Laundry Booking",
    description:
      "Check machine availability, book slots in advance, and get notified when your laundry is done.",
    icon: FaJugDetergent,
    colorClass: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Maintenance Tickets",
    description:
      "Report issues in dorms or classrooms instantly. Track repair status from \"Reported\" to \"Fixed\".",
    icon: FaScrewdriverWrench,
    colorClass: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Community Forum",
    description:
      "A dedicated space for student discussions, polls, and community building securely within the campus network.",
    icon: FaComments,
    colorClass: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Digital Notices",
    description:
      "Replace paper noticeboards. Admins broadcast important updates, exam schedules, and events instantly.",
    icon: FaBullhorn,
    colorClass: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Admin Control",
    description:
      "Comprehensive dashboards for staff to manage users, orders, and tickets with data-driven insights.",
    icon: FaChartPie,
    colorClass: "bg-secondary text-secondary-foreground",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">
            Everything You Need
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            A complete ecosystem for campus life
          </h3>
          <p className="text-lg text-muted-foreground">
            Designed to bridge the gap between administration and students with
            modular, role-based tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-lg bg-card hover:bg-accent/50 transition-all border border-border shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200",
                  feature.colorClass
                )}
              >
                <feature.icon className="text-xl" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
