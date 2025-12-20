import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { FaArrowLeft, FaUtensils, FaBowlRice, FaFireFlameCurved, FaStopwatch, FaPizzaSlice } from "react-icons/fa6";

export default function ZenCanteen() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px] -mt-20 -mr-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px] -mb-20 -ml-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6 border border-orange-500/20">
                <FaUtensils /> ZenCanteen
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight">
                Dining Made <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
                  Digital
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Skip the long lunch queues. Pre-order your meals, track your calorie intake, and enjoy a seamless dining experience on campus.
              </p>
              <div className="flex gap-4">
                <a href="https://zencampuscanteen.netlify.app/login" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </button>
                </a>                
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:-rotate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Trending Now</h3>
                    <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold flex items-center gap-1">
                      Lunch Menu
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1 bg-background/50 p-4 rounded-xl border border-border group">
                        <div className="h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg mb-3 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110 duration-300">
                           <FaBowlRice className="text-5xl" />
                        </div>
                        <h4 className="font-bold">Healthy Rice Bowl</h4>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-orange-500 font-bold">₹120</span>
                           <span className="text-xs text-muted-foreground">450 cal</span>
                        </div>
                        <button className="w-full mt-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors">Add to Cart</button>
                     </div>
                     <div className="col-span-2 md:col-span-1 bg-background/50 p-4 rounded-xl border border-border group">
                        <div className="h-32 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg mb-3 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-110 duration-300">
                           <FaPizzaSlice className="text-5xl" />
                        </div>
                        <h4 className="font-bold">Cheese Pizza Slice</h4>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-orange-500 font-bold">₹80</span>
                           <span className="text-xs text-muted-foreground">300 cal</span>
                        </div>
                         <button className="w-full mt-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors">Add to Cart</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Taste the Convenience</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 text-2xl">
                 <FaStopwatch />
               </div>
               <h3 className="text-xl font-bold mb-3">Pre-Ordering</h3>
               <p className="text-muted-foreground">Order your food while you&apos;re in class. It&apos;ll be hot and ready for pickup when the bell rings.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 text-2xl">
                 <FaFireFlameCurved />
               </div>
               <h3 className="text-xl font-bold mb-3">Calorie Tracking</h3>
               <p className="text-muted-foreground">Stay fit. Automatically track nutritional values of every meal you order through the app.</p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 text-2xl">
                 <FaBowlRice />
               </div>
               <h3 className="text-xl font-bold mb-3">Menu Management</h3>
               <p className="text-muted-foreground">Admins can easily update daily specials, prices, and stock availability in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
