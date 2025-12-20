import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaScrewdriverWrench, FaClipboardCheck, FaHelmetSafety, FaCamera, FaListCheck } from "react-icons/fa6";

export default function ZenFix() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
            
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-stone-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 text-sm font-medium mb-6 border border-slate-500/20">
                <FaScrewdriverWrench /> ZenFix
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Facilities <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-stone-500 dark:from-slate-400 dark:to-stone-300">
                  On Autopilot
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Streamline campus maintenance with 1-click reporting. Track tickets from submission to resolution in real-time.
              </p>
              <div className="flex gap-4">
                <a href="https://zencampusfix.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full font-bold shadow-lg shadow-slate-500/25 transition-all hover:scale-105 active:scale-95">
                    Book Service
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Recent Tickets</h3>
                     <div className="flex -space-x-2">
                         {[1, 2, 3].map((i) => <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background"></div>)}
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-background/50 border border-border flex gap-4">
                         <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <FaScrewdriverWrench />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between">
                               <h4 className="font-bold">Broken AC - Room 304</h4>
                               <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold">In Progress</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Assigned to: John Tech</p>
                            <div className="mt-2 w-full bg-muted h-1 rounded-full">
                               <div className="w-1/2 h-full bg-yellow-500 rounded-full"></div>
                            </div>
                         </div>
                      </div>

                       <div className="p-4 rounded-xl bg-background/50 border border-border flex gap-4 opacity-70">
                         <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <FaListCheck />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between">
                               <h4 className="font-bold">Leaking Tap - Washroom 2</h4>
                               <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">Resolved</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Resolved by: Mike Plumb</p>
                            <div className="mt-2 w-full bg-muted h-1 rounded-full">
                               <div className="w-full h-full bg-green-500 rounded-full"></div>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Maintain Excellence</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 text-2xl">
                 <FaCamera />
               </div>
               <h3 className="text-xl font-bold mb-3">Photo Evidence</h3>
               <p className="text-muted-foreground">Snap a picture, add a description, and hit send. Reporting maintenance issues has never been faster.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 text-2xl">
                 <FaClipboardCheck />
               </div>
               <h3 className="text-xl font-bold mb-3">Track Progress</h3>
               <p className="text-muted-foreground">See exactly when your request is viewed, assigned, and completed. Radical transparency.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 text-2xl">
                 <FaHelmetSafety />
               </div>
               <h3 className="text-xl font-bold mb-3">Staff Assignment</h3>
               <p className="text-muted-foreground">Auto-assign tickets to the right personnel based on the category (Plumbing, Electrical, etc.).</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
