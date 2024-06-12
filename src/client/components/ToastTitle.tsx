import React from "react";

interface ToastTitleProps {
  spritePath: string;
  children: React.ReactNode;
}

function ToastTitle({ spritePath, children }: ToastTitleProps) {
  return (
    <div className="flex items-center justify-center gap-x-4">
      <img src={spritePath} className="h-10" />
      {children}
    </div>
  );
}

export { ToastTitle };
