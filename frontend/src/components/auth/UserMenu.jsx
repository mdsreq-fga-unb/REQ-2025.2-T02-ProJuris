import React, { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";

const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-menu-btn"
        onClick={() => setOpen(!open)}
      >
        <img src={user.avatar} alt="avatar" className="user-avatar" />
        <span className="user-menu-name">{user.nome}</span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <button className="dropdown-item" onClick={onLogout}>
            <LogOut size={18} />
            Sair da Conta
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
