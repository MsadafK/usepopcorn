import { ReactNode } from "react";

interface NavBarProps {
  children: ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  return <nav className="nav-bar">{children}</nav>;
}
