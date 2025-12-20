import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaBroom, FaSprayCan, FaCalendarCheck, FaStar } from "react-icons/fa6";

export default function ZenClean() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 border border-teal-500/20">
                <FaBroom /> ZenClean
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Experience <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300">
                  Pristine Living
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Spotless rooms on demand. Schedule cleaning, track service status, and rate your experience for a better campus environment.
              </p>
              <div className="flex gap-4">
                <a href="https://zencampusclean.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95">
                    Book Service
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Today&apos;s Schedule</h3>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> On Time
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mr-4 shrink-0">
                           <FaBroom className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">Room 30{i} - Deep Clean</span>
                            <span className="text-xs text-muted-foreground">10:00 AM</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                            <div className={`h-full rounded-full ${i === 1 ? 'w-full bg-emerald-500' : 'w-0'}`}></div>
                          </div>
                          {i === 1 && <div className="text-[10px] text-emerald-500 mt-1">Completed</div>}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Sparkling Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 text-2xl">
                 <FaCalendarCheck />
               </div>
               <h3 className="text-xl font-bold mb-3">Flexible Scheduling</h3>
               <p className="text-muted-foreground">Choose a time slot that fits your class schedule. Recurring bookings available for hassle-free maintenance.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 text-2xl">
                 <FaSprayCan />
               </div>
               <h3 className="text-xl font-bold mb-3">Service Tracking</h3>
               <p className="text-muted-foreground">Know exactly when the cleaning staff arrives and finishes. Get photo proof of completed work.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 text-2xl">
                 <FaStar />
               </div>
               <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
               <p className="text-muted-foreground">Rate your service after every visit. Our feedback loop ensures high standards are always met.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
