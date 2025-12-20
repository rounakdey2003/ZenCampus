"use client";

import { motion } from "framer-motion";
import {
  FaReact,
  FaJs,
  FaWind,
  FaDatabase,
  FaShieldHalved,
} from "react-icons/fa6";

export function TechStack() {
  return (
    <section
      id="tech-stack"
      className="py-20 bg-background overflow-hidden relative border-t border-border"
    >      
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">
              Under the Hood
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Built with the modern web stack.
            </h3>
            <p className="text-muted-foreground max-w-lg text-lg mb-8 leading-relaxed">
              ZenCampus leverages the latest technologies for performance,
              scalability, and developer experience. It is a full-stack
              application built for the future.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full cursor-default hover:bg-accent transition-all">
                <FaReact className="text-blue-400" /> Next.js
              </div>
              <div className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full cursor-default hover:bg-accent transition-all">
                <FaJs className="text-yellow-400" /> TypeScript
              </div>
              <div className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full cursor-default hover:bg-accent transition-all">
                <FaWind className="text-cyan-400" /> Tailwind CSS
              </div>
              <div className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full cursor-default hover:bg-accent transition-all">
                <FaDatabase className="text-green-500" /> MongoDB
              </div>
              <div className="flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-full cursor-default hover:bg-accent transition-all">
                <FaShieldHalved className="text-purple-400" /> NextAuth
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-card backdrop-blur rounded-xl border border-border shadow-2xl overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-muted-foreground text-xs">
                  api/canteen/order/route.ts
                </span>
              </div>
              <div className="p-6 text-foreground overflow-x-auto bg-muted/30">
                <pre>
                  <code>
                    <span className="text-purple-400">import</span>{" "}
                    {"{ NextResponse }"} <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">&apos;next/server&apos;</span>;
                    <br />
                    <span className="text-purple-400">import</span> {"{ auth }"}{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">&apos;@/auth&apos;</span>;
                    <br />
                    <span className="text-purple-400">import</span> db{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">&apos;@/lib/db&apos;</span>;
                    <br />
                    <br />
                    <span className="text-purple-400">export async function</span>{" "}
                    <span className="text-blue-400">POST</span>(req: Request) {"{"}
                    <br />
                    {"  "}
                    <span className="text-gray-500">{"// Verify session"}</span>
                    <br />
                    {"  "}
                    <span className="text-purple-400">const</span> session ={" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-400">auth</span>();
                    <br />
                    {"  "}
                    <span className="text-purple-400">if</span> (!session){" "}
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-blue-400">NextResponse.json</span>
                    ({"{"} error: <span className="text-green-400">&apos;Unauthorized&apos;</span>{" "}
                    {"}"}, {"{"} status: <span className="text-orange-400">401</span> {"}"});
                    <br />
                    <br />
                    {"  "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-400">db.connect</span>();
                    <br />
                    {"  "}
                    <br />
                    {"  "}
                    <span className="text-gray-500">{"// Create order logic..."}</span>
                    <br />
                    {"  "}
                    <span className="text-purple-400">const</span> order ={" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-400">Order.create</span>({"{"}
                    <br />
                    {"    "}user: session.user.id,
                    <br />
                    {"    "}items: req.body.items,
                    <br />
                    {"    "}status: <span className="text-green-400">&apos;PENDING&apos;</span>
                    <br />
                    {"  }"});
                    <br />
                    <br />
                    {"  "}
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-blue-400">NextResponse.json</span>(order);
                    <br />
                    {"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
