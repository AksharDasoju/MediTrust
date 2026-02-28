import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/meditrust-icon.png";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Check Bill" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MediTrust logo" className="h-8 w-auto" />
          <span className="font-bold text-lg text-foreground">MediTrust</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
