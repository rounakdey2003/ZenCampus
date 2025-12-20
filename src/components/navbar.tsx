"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGraduationCap, FaGithub, FaBars, FaXmark } from "react-icons/fa6";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/40 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">          
          <div className="flex items-center">
            <Link
              href="#"
              className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-lg outline-none"
            >
              <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/25">
                <FaGraduationCap className="text-xl" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                Zen<span className="text-primary">Campus</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#products"
              className="text-muted-foreground hover:text-primary font-medium transition-colors hover:scale-105 duration-200"
            >
              Products
            </Link>
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary font-medium transition-colors hover:scale-105 duration-200"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-primary font-medium transition-colors hover:scale-105 duration-200"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-primary font-medium transition-colors hover:scale-105 duration-200"
            >
              About
            </Link>

            <div className="w-px h-6 bg-border mx-2"></div>

            <Link
              href="https://github.com/rounakdey2003/ZenCampusPromo"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
            >
              <FaGithub className="text-xl" />
            </Link>

            <a
              href="https://zencampusapp.netlify.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </a>
          </div>
          
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-primary/80 transition-colors p-2"
            >
              {isOpen ? <FaXmark className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>      

      <div 
        className={`md:hidden absolute top-full left-0 w-full glass border-b border-border/40 transition-all duration-300 origin-top overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4 flex flex-col items-center">
          <Link
            href="#products"
            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="#features"
            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <a
            href="https://zencampusapp.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-primary text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
