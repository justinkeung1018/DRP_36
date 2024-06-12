import React from "react";

interface HeaderProps {
  spritePath: string;
  children: React.ReactNode;
}

function Header({ spritePath, children }: HeaderProps) {
  return (
    <div className="pb-2 pt-2 fixed top-0 left-0 right-0 h-[8vh] bg-white flex items-center justify-center gap-x-4 drop-shadow-md">
      <img
        // src="./images/sprites/hearts.png"
        src={spritePath}
        className="object-contain h-10"
      />
      <h1 className="text-lg font-medium">{children}</h1>
    </div>
  );
}

export { Header };
