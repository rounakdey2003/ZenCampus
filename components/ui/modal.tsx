"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between p-6 border-b", className)}>
      <h3 className="text-2xl font-bold">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 p-6 border-t", className)}>
      {children}
    </div>
  );
}
