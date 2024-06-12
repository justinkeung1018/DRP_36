import React from "react";
import { Button } from "./shadcn/Button";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  spritePath: string;
  withBackButton?: boolean;
  children: React.ReactNode;
}

function Header({ spritePath, withBackButton, children }: HeaderProps) {
  return (
    <div className="pb-2 pt-2 fixed top-0 left-0 right-0 h-[8vh] bg-white flex items-center justify-center gap-x-4 drop-shadow-md">
      {withBackButton && (
        <Link to="/" className="absolute m-auto left-5">
          <IoChevronBack size={30} />
        </Link>
      )}
      <img src={spritePath} className="object-contain h-10" />
      <h1 className="text-lg font-medium">{children}</h1>
    </div>
  );
}

export { Header };
