import React from "react";

export default function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} border-cyan-500 border-t-transparent rounded-full animate-spin ${className}`} />
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <LoadingSpinner size="lg" />
      <p className="text-slate-300 mt-4 animate-pulse">{message}</p>
    </div>
  );
}
