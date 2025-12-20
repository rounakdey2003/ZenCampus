import Link from "next/link";
import {
  FaGithub,
  FaGraduationCap,
  FaArrowRight,
  FaShieldHalved,
  FaBolt,
  FaCloud,
  FaCircleCheck,
  FaBurger,
  FaShirt,
  FaScrewdriverWrench
} from "react-icons/fa6";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">      
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] dark:bg-blue-500/20 animate-pulse delay-700"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] dark:bg-purple-500/20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] dark:bg-indigo-500/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8 animate-fade-in border border-primary/20 hover:border-primary/40 transition-colors cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-muted-foreground">The future of campus administration is here</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight mb-8 animate-fade-up">
            Your Complete <br className="hidden md:block" />
            <span className="text-gradient">Campus Ecosystem</span>
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up delay-100 font-light">
            One platform to manage dorms, dining, maintenance, and more. 
            Empower your institution with ZenCampus.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up delay-200">
            <Link
              href="#products"
              className="px-8 py-4 bg-primary text-white rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Explore Products <FaArrowRight />
            </Link>
            <Link
              href="https://github.com/rounakdey2003/ZenCampus"
              target="_blank"
              className="px-8 py-4 glass text-foreground rounded-full font-medium text-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FaGithub /> Star on GitHub
            </Link>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-6xl animate-fade-up delay-300 perspective-1000">
          <div className="relative rounded-2xl glass-card p-2 ring-1 ring-white/20 dark:ring-white/10 shadow-2xl transform rotate-x-2 transition-transform hover:rotate-x-0 duration-700">            
            <div className="absolute top-0 left-0 right-0 h-12 bg-white/50 dark:bg-black/50 border-b border-white/10 flex items-center px-4 rounded-t-2xl gap-2 z-20 backdrop-blur-md">
               <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <div className="mx-auto text-xs font-medium text-muted-foreground/50 font-mono">dashboard.zencampus.com</div>
            </div>

            <div className="bg-background/40 rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9] relative pt-12">              
              <div className="absolute inset-0 top-12 grid grid-cols-12 gap-0 h-full">
                
                <div className="col-span-1 hidden lg:flex flex-col items-center py-6 border-r border-white/10 bg-white/5 gap-6">
                   <div className="p-3 bg-primary/20 rounded-xl text-primary"><FaGraduationCap className="text-xl"/></div>
                   <div className="w-8 h-[1px] bg-white/10"></div>
                   <div className="flex flex-col gap-4">
                     <div className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"><FaCloud /></div>
                     <div className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"><FaShieldHalved /></div>
                     <div className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"><FaBolt /></div>
                   </div>
                </div>

                <div className="col-span-12 lg:col-span-11 p-8 overflow-hidden relative">
                   <div className="flex justify-between items-end mb-8">
                      <div>
                        <div className="h-2 w-32 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-64 bg-foreground/10 rounded"></div>
                      </div>
                      <div className="flex gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                         <div className="h-10 w-24 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">Add New</div>
                      </div>
                   </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass p-6 rounded-2xl border-white/5">
                         <div className="flex justify-between mb-4">
                            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><FaShirt /></div>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
                         </div>
                         <div className="text-2xl font-bold mb-1">2,450</div>
                         <div className="text-sm text-muted-foreground">Laundry Cycles</div>
                      </div>

                      <div className="glass p-6 rounded-2xl border-white/5">
                         <div className="flex justify-between mb-4">
                            <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><FaBurger /></div>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+5%</span>
                         </div>
                         <div className="text-2xl font-bold mb-1">₹45.2k</div>
                         <div className="text-sm text-muted-foreground">Canteen Revenue</div>
                      </div>

                      <div className="glass p-6 rounded-2xl border-white/5">
                         <div className="flex justify-between mb-4">
                            <div className="p-3 bg-slate-500/20 text-slate-500 rounded-xl"><FaScrewdriverWrench /></div>
                            <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">-2%</span>
                         </div>
                         <div className="text-2xl font-bold mb-1">12</div>
                         <div className="text-sm text-muted-foreground">Open Tickets</div>
                      </div>
                   </div>

                   <div className="mt-6 h-64 glass rounded-2xl border-white/5 w-full flex items-end justify-between p-6 gap-2">
                      {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 95].map((h, i) => (
                          <div key={i} className="w-full bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-lg transition-all hover:to-primary" style={{ height: `${h}%` }}></div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-12 top-20 bg-card/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10 hidden lg:block animate-float">
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xl"><FaCircleCheck /></div>
                  <div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">System Status</div>
                    <div className="font-bold text-foreground">All Systems Operational</div>
                  </div>
               </div>
            </div>

             <div className="absolute -left-8 bottom-32 bg-card/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                     <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">New Request</div>
                    <div className="font-bold text-foreground">Dorm Maintenance #402</div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
