import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaGraduationCap, FaCalendarDays, FaBullhorn, FaUsers, FaMasksTheater } from "react-icons/fa6";

export default function ZenCampusMain() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
            
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20">
                <FaGraduationCap /> ZenCampus
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                The Central <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-300">
                  Nervous System
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                The hub that connects it all. From academic notices to event management and student forums, keep your entire campus synchronized.
              </p>
              <div className="flex gap-4">
                <a href="https://zencampusapp.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </button>
                </a>    
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                     <div className="p-4 bg-background/60 rounded-xl border border-border">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                           <div>
                              <div className="font-bold">Admin Office</div>
                              <div className="text-xs text-muted-foreground">Just now</div>
                           </div>
                        </div>
                        <p className="text-sm mb-3">
                           <FaBullhorn className="inline mr-2 text-primary" /> <span className="font-bold">Important Notice:</span> Mid-term exam schedules have been revised. Please check the attached PDF for the updated timeline.
                        </p>
                        <div className="h-24 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-500 font-medium">
                           <FaBullhorn className="mr-2" /> PDF Preview
                        </div>
                     </div>
                     
                      <div className="p-4 bg-background/60 rounded-xl border border-border opacity-80">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">S</div>
                           <div>
                              <div className="font-bold">Student Council</div>
                              <div className="text-xs text-muted-foreground">2 hours ago</div>
                           </div>
                        </div>
                        <p className="text-sm">
                           Join us for the annual Cultural Fest kickoff tomorrow at 5 PM in the main auditorium! <FaMasksTheater className="inline ml-2 text-purple-500" />
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Connect & Collaborate</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 text-2xl">
                 <FaBullhorn />
               </div>
               <h3 className="text-xl font-bold mb-3">Instant Notices</h3>
               <p className="text-muted-foreground">Broadcast critical information to the entire campus or specific batches instantly via push notifications.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 text-2xl">
                 <FaCalendarDays />
               </div>
               <h3 className="text-xl font-bold mb-3">Event Management</h3>
               <p className="text-muted-foreground">Organize events, manage RSVPs, and keep the campus calendar up to date.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 text-2xl">
                 <FaUsers />
               </div>
               <h3 className="text-xl font-bold mb-3">Community Forums</h3>
               <p className="text-muted-foreground">A safe space for students to discuss projects, share notes, and build community.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
