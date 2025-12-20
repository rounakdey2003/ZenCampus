import Link from "next/link";
import { FaGraduationCap, FaGithub, FaTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="#" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <FaGraduationCap className="text-lg" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Zen<span className="text-primary">Campus</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              The smart campus management platform built for the modern
              educational experience. Open source and ready to deploy.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#tech-stack"
                  className="hover:text-foreground transition-colors"
                >
                  Tech Stack
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/rounakdey2003/ZenCampus"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm">Connect</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link
                  href="https://github.com/rounakdey2003/ZenCampus"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/rounakdey2003"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 ZenCampus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
