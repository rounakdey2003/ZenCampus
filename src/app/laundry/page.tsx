import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaJugDetergent, FaMobileScreen, FaClock, FaQrcode } from "react-icons/fa6";

export default function ZenLaundry() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                <FaJugDetergent /> ZenLaundry
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Revolutionize <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                  Campus Laundry
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                No more waiting in lines or hunting for coins. Check machine availability in real-time, book slots, and get notified when your clothes are done.
              </p>
              <div className="flex gap-4">
                <a href="https://zenwash.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </button>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Washing Machine Status</h3>
                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                           <FaJugDetergent className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold">Machine #{items(i)}</span>
                            <span className="text-xs font-medium text-muted-foreground">{i === 1 ? 'Running' : 'Available'}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${i === 1 ? 'w-2/3 bg-blue-500' : 'w-0'}`}></div>
                          </div>
                          {i === 1 && <div className="text-xs text-blue-500 mt-1">12 mins remaining</div>}
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
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Smart Features for Modern Students</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 text-2xl">
                 <FaMobileScreen />
               </div>
               <h3 className="text-xl font-bold mb-3">Remote Booking</h3>
               <p className="text-muted-foreground">Check availability and book machines from your dorm room. No more carrying laundry baskets for nothing.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 text-2xl">
                 <FaClock />
               </div>
               <h3 className="text-xl font-bold mb-3">Cycle Notifications</h3>
               <p className="text-muted-foreground">Get notified instantly when your cycle is complete. Never let your clothes sit in the machine again.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 text-2xl">
                 <FaQrcode />
               </div>
               <h3 className="text-xl font-bold mb-3">QR Payments</h3>
               <p className="text-muted-foreground">Go cashless. Scan the QR code on the machine to pay securely via the app wallet.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function items(i: number) {
 return i < 10 ? `0${i}` : i; 
}
