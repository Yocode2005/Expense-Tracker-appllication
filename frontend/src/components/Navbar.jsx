import { useState, useRef } from "react";
import { navbarStyles } from "../assets/dummyStyles.js";
import img1 from "../assets/logo.png";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Base_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function Navbar({ user: propUser, onLogout }) {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [localUser,setLocalUser] = useState(null);

  const user = propUser || localUser || {
    name: "",
    email: "",
  };

  // to fetch the user data from the server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${Base_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user || response.data;
        setLocalUser(userData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    if (!propUser || !propUser.name) {
      fetchUserData();
    }
  }, [propUser]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    onLogout?.();
    navigate("/login");
  };

  // closes the toggle menu when clicked outside the box
   useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/*logo */}
        <div
          onClick={() => navigate("/")}
          className={navbarStyles.logoContainer}
        >
          <div className={navbarStyles.logoImage}>
            <img src={img1} alt="logo" />
          </div>
          <span className={navbarStyles.logoText}>Expense Tracker</span>
        </div>
        {/* if the user is present */}
        {user && (
          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={navbarStyles.userButton}>
              <div className="relative">
                <div className={navbarStyles.userAvatar}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className={navbarStyles.statusIndicator}></div>
              </div>
              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                <p className={navbarStyles.userEmail}>
                  {user?.email || "user@expensetracker.com"}
                </p>
              </div>
              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
            </button>
            {/* dropdown menu */}
            {menuOpen && (
              <div className={navbarStyles.dropdownMenu}>
                <div className={navbarStyles.dropdownHeader}>
                  <div className="flex items-center gap-3">
                    <div className={navbarStyles.dropdownAvatar}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className={navbarStyles.dropdownName}>
                        {user?.name || "User"}
                      </div>
                      <div className={navbarStyles.dropdownEmail}>
                        {user?.email || "user@expensetracker.com"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={navbarStyles.menuItemContainer}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className={navbarStyles.menuItem}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </div>
                <div className={navbarStyles.menuItemBorder}>
                  <button
                    onClick={handleLogout}
                    className={navbarStyles.logoutButton}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
