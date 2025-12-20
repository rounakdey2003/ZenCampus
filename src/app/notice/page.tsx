import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaBullhorn, FaBell, FaCalendarCheck, FaTags } from "react-icons/fa6";

export default function ZenNotice() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-6 border border-yellow-500/20">
                <FaBullhorn /> ZenNotice
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Instant <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-500 dark:from-yellow-400 dark:to-orange-300">
                  Campus Updates
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Stay informed instantly. Real-time updates, official announcements, and categorized alerts so you never miss a deadline.
              </p>
              <div className="flex gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-bold shadow-lg shadow-yellow-500/25 transition-all hover:scale-105 active:scale-95">
                    Start Browsing
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Latest Notices</h3>
                    <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> New
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start p-4 rounded-xl bg-background/50 border border-border">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-4 shrink-0">
                           <FaTags className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">Exam Schedule Released</span>
                            <span className="text-xs text-muted-foreground">2h ago</span>
                          </div>
                          <p className="text-xs text-muted-foreground">The final semester examination schedule has been published on the portal.</p>
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
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Stay in the Loop</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6 text-2xl">
                 <FaBell />
               </div>
               <h3 className="text-xl font-bold mb-3">Real-time Push</h3>
               <p className="text-muted-foreground">Receive instant notifications on your device for urgent announcements and deadline reminders.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 text-2xl">
                 <FaTags />
               </div>
               <h3 className="text-xl font-bold mb-3">Categorized Feeds</h3>
               <p className="text-muted-foreground">Filter notices by department, exams, events, or admin to find exactly what you need.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 text-2xl">
                 <FaCalendarCheck />
               </div>
               <h3 className="text-xl font-bold mb-3">Event Sync</h3>
               <p className="text-muted-foreground">Automatically add important dates and deadlines from notices directly to your academic calendar.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
