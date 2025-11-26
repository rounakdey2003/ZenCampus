"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, X } from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";

export function DashboardHeader({ title }: { title: string }) {
  const { data: session } = useSession();
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (showQRModal && session?.user?.usn) {
      QRCode.toDataURL(session.user.usn, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      }).then(setQrCodeUrl).catch(console.error);

    }
  }, [showQRModal, session?.user?.usn]);

  return (
    <>
      <header className="bg-transparent px-4 py-4 md:px-8 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-lg">
              Welcome back, <span className="text-foreground font-medium">{session?.user?.name || "User"}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button 
              onClick={() => setShowQRModal(true)}
              className="group flex items-center gap-3 bg-white px-3 py-2 md:px-5 md:py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-border"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{session?.user?.usn || "USN001"}</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {showQRModal && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-card rounded-3xl p-10 max-w-md w-full shadow-2xl border border-border/50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Student ID</h3>
              <p className="text-muted-foreground mb-8">Scan for quick identification</p>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border inline-block mb-8">
                {qrCodeUrl ? (
                  <Image src={qrCodeUrl} alt="QR Code" width={256} height={256} className="w-64 h-64" />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-secondary/50 rounded-2xl">
                  <p className="text-xl font-bold text-foreground">{session?.user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground mt-1">USN: {session?.user?.usn || "USN001"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
