import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaComments, FaUsers, FaLightbulb, FaReply } from "react-icons/fa6";

export default function ZenConnect() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium mb-6 border border-pink-500/20">
                <FaComments /> ZenConnect
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Foster <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-300">
                  Campus Community
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Collaborate and discuss. Join student forums, ask questions to experts, and build meaningful networks across campus.
              </p>
              <div className="flex gap-4">
                <a href="https://zencampusconnect.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95">
                    Start Discussing
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Trending Topics</h3>
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Active
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start p-4 rounded-xl bg-background/50 border border-border">
                        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-4 shrink-0">
                           <FaComments className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">Best resources for react?</span>
                            <span className="text-xs text-muted-foreground">15 replies</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Hey everyone, looking for some good tutorials...</p>
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
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Connect & Grow</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 text-2xl">
                 <FaUsers />
               </div>
               <h3 className="text-xl font-bold mb-3">Student Forums</h3>
               <p className="text-muted-foreground">Join detailed discussions on various topics ranging from tech to arts and sports.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 text-2xl">
                 <FaLightbulb />
               </div>
               <h3 className="text-xl font-bold mb-3">Expert Q&A</h3>
               <p className="text-muted-foreground">Get answers from seniors and professors. Validated and pinned for everyone&apos;s benefit.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-6 text-2xl">
                 <FaReply />
               </div>
               <h3 className="text-xl font-bold mb-3">Peer Support</h3>
               <p className="text-muted-foreground">Helping hands are always around. Share notes, tips, and collaborate on projects.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
