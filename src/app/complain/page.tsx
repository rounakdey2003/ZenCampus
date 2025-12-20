import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaHeadset, FaCircleExclamation, FaUserSecret, FaCircleCheck } from "react-icons/fa6";

export default function ZenResolve() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium mb-6 border border-red-500/20">
                <FaHeadset /> ZenResolve
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Your Voice <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-500 dark:from-red-400 dark:to-amber-300">
                  Matters Here
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Efficient grievance redressal. Report issues, track ticket status, and ensure your concerns are heard and resolved quickly.
              </p>
              <div className="flex gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95">
                    File a Report
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Ticket Status</h3>
                    <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div> Processing
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 ${i === 1 ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' : 'bg-green-100 text-green-500 dark:bg-green-900/30'}`}>
                           {i === 1 ? <FaCircleExclamation className="text-sm" /> : <FaCircleCheck className="text-sm" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">Ticket #202{i}</span>
                            <span className={`text-xs font-bold ${i === 1 ? 'text-orange-500' : 'text-green-500'}`}>{i === 1 ? 'In Progress' : 'Resolved'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{i === 1 ? 'Wi-Fi connectivity issue in Block B' : 'Leaking tap in washroom'}</p>
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
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Efficient Resolution</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 text-2xl">
                 <FaUserSecret />
               </div>
               <h3 className="text-xl font-bold mb-3">Anonymous Reporting</h3>
               <p className="text-muted-foreground">Feel safe to speak up. Option to report sensitive issues without revealing your identity.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 text-2xl">
                 <FaCircleExclamation />
               </div>
               <h3 className="text-xl font-bold mb-3">Track Tickets</h3>
               <p className="text-muted-foreground">Stay updated on the progress of your complaints with real-time status changes and admin remarks.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 text-2xl">
                 <FaCircleCheck />
               </div>
               <h3 className="text-xl font-bold mb-3">Quick Action</h3>
               <p className="text-muted-foreground">Automated routing ensures your complaint reaches the right authority immediately for faster resolution.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
