"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCircleCheck } from "react-icons/fa6";

const plans = [
  {
    name: "Individual App",
    description: "Perfect for starting your digital transformation journey.",
    price: { monthly: 499, annual: 4990 },
    features: [
      "Access to 1 chosen module",
      "Basic Analytics",
      "Email Support",
      "99.9% Uptime",
      "Unlimited Users"
    ],
    highlight: false,
    color: "bg-card"
  },
  {
    name: "Campus Bundle",
    description: "The complete ecosystem for modern institutions.",
    price: { monthly: 1499, annual: 14990 },
    features: [
      "All 4 Modules Included",
      "Advanced AI Analytics",
      "24/7 Priority Support",
      "Custom Branding",
      "Dedicated Account Manager",
      "API Access"
    ],
    highlight: true,
    color: "bg-primary text-primary-foreground"
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large universities.",
    price: { monthly: "Custom", annual: "Custom" },
    features: [
      "Multi-campus Support",
      "On-premise Deployment",
      "SLA Guarantees",
      "Custom Integrations",
      "White-label Mobile App"
    ],
    highlight: false,
    color: "bg-card"
  }
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
          <p className="text-muted-foreground text-lg mb-8">
            Choose the plan that fits your campus size and needs.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-muted rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-primary shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}
              ></div>
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly <span className="text-xs text-green-500 font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-3xl p-8 border hover:scale-105 transition-transform duration-300 relative flex flex-col ${
                plan.highlight 
                  ? 'bg-gradient-to-br from-primary to-blue-600 text-white border-primary shadow-2xl shadow-primary/20' 
                  : 'bg-card border-border backdrop-blur-sm shadow-xl'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 shadow-lg bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                <p className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {typeof plan.price.monthly === 'number' ? (
                    <>
                      <span className="text-4xl font-bold">₹{isAnnual ? plan.price.annual : plan.price.monthly}</span>
                      <span className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-muted-foreground'}`}>/{isAnnual ? 'year' : 'month'}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">{plan.price.monthly}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <FaCircleCheck className={`flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-blue-50' : 'text-muted-foreground'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-medium transition-all ${
                plan.highlight 
                  ? 'bg-white text-primary hover:bg-blue-50 shadow-lg' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
              }`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
