
import { FaJugDetergent, FaUtensils, FaScrewdriverWrench, FaGraduationCap, FaArrowRight, FaBullhorn, FaComments, FaHeadset, FaBroom } from "react-icons/fa6";
import Link from "next/link";

const products = [
  {
    id: "campus",
    name: "ZenCampus",
    description: "The central hub connecting everything. Academic notices, events, and unified control.",
    icon: FaGraduationCap,
    color: "from-indigo-400 to-purple-300",
    link: "/campus"
  },
  {
    id: "canteen",
    name: "ZenCanteen",
    description: "Digitized food ordering. Pre-order meals, track calories, and skip the long queues.",
    icon: FaUtensils,
    color: "from-orange-400 to-amber-300",
    link: "/canteen"
  },
  {
    id: "laundry",
    name: "ZenWash",
    description: "Smart laundry management system. Track machines, schedule washes, and pay effortlessly.",
    icon: FaJugDetergent,
    color: "from-blue-400 to-cyan-300",
    link: "/laundry"
  },
  {
    id: "maintenance",
    name: "ZenFix",
    description: "Effortless facility handling. Report issues, track tickets, and ensure a better campus environment.",
    icon: FaScrewdriverWrench,
    color: "from-slate-400 to-gray-300",
    link: "/maintenance"
  },
  {
    id: "notice",
    name: "ZenNotice",
    description: "Stay informed instantly. Real-time updates, official announcements, and categorized alerts.",
    icon: FaBullhorn,
    color: "from-yellow-400 to-orange-300",
    link: "/notice"
  },
  {
    id: "discussion",
    name: "ZenConnect",
    description: "Collaborate and discuss. Student forums, peer-to-peer help, and academic networking.",
    icon: FaComments,
    color: "from-pink-400 to-rose-300",
    link: "/discussion"
  },
  {
    id: "complain",
    name: "ZenResolve",
    description: "Voice your concerns. Efficient grievance redressal with anonymous reporting and tracking.",
    icon: FaHeadset,
    color: "from-red-400 to-amber-300",
    link: "/complain"
  },
  {
    id: "cleaning",
    name: "ZenClean",
    description: "Spotless campus living. On-demand room cleaning, status tracking, and service rating.",
    icon: FaBroom,
    color: "from-teal-400 to-emerald-300",
    link: "/cleaning"
  }
];

export function Products() {
  return (
    <section id="products" className="py-20 bg-secondary/30 relative overflow-hidden">
       <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
       
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Our Suite of <span className="text-gradient">Products</span></h2>
          <p className="text-muted-foreground text-lg">
            A comprehensive ecosystem designed to modernize every aspect of campus life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group relative glass rounded-3xl p-6 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <product.icon />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <Link 
                  href={product.link}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/70 transition-colors group"
                >
                  Learn more <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
