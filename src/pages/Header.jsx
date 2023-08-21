import "../index.css";
import "../App.css";

import { useContext } from "react";
import { CounterContext } from "../contexts/Counter";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_ANON_KEY
);

function Header() {
  const { user } = useContext(CounterContext);
  // console.log(user);
  const navigate = useNavigate();
  //   console.log(user); // Log do user
  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
      window.location.reload(); // Recarregar a página após o logout
    } else {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <div>
      {Object.keys(user) != 0 ? (
        <div className="app-container">
          <header className="header">
            <div className="flex items-center justify-evenly ">
              <div>
                <ul className="ulHeader">
                  <Link to="/compilation">
                    <img
                      src="/src/assets/logo.svg"
                      alt="Logo"
                      className="logo"
                    />
                  </Link>
                </ul>
              </div>
              <div>
                <ul className="ulHeader">
                  <li className="p-2  text-lg/2  text-slate-900 ">
                    <Link to="/compilation">Home</Link>
                  </li>
                  <li className="yourPosts p-2 text-lg/2  text-slate-900 ">
                    <Link to="/success">Your Posts</Link>
                  </li>
                  <li className="p-2  text-lg/2  text-slate-900 ">
                    <Link to="/createposts">Create new posts</Link>
                  </li>
                  <li className="p-2  text-lg/2  text-slate-900 ">Contact</li>
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="avatar-image"
                  />
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded"
                    onClick={signOutUser}
                  >
                    Logout
                  </button>
                </ul>
              </div>
            </div>
          </header>
        </div>
      ) : (
        <div className="app-container">
          <header className="header">
            <div className="flex items-center justify-evenly ">
              <div>
                <ul className="ulHeader">
                  <Link to="/compilation">
                    <img
                      src="/src/assets/logo.svg"
                      alt="Logo"
                      className="logo"
                    />
                  </Link>
                </ul>
              </div>
              <div>
                <ul className="ulHeader logoHome">
                  <li className="p-2  text-lg/2 w-8 text-slate-900 ">
                    <Link to="/compilation">
                      <img
                        src="/src/assets/home-house-svgrepo-com.svg"
                        alt="Logo"
                        className="logoHome"
                      />
                    </Link>
                    <Link to="/compilation"></Link>
                  </li>

                  <li className="p-2  text-lg/2  text-slate-900 ">
                    <Link to="/">Create new posts</Link>
                  </li>
                  <li className="p-2  text-lg/2  text-slate-900 ">Contact</li>

                  <button
                    className="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded"
                    onClick={signOutUser}
                  >
                    Logout
                  </button>
                </ul>
              </div>
            </div>
          </header>
        </div>
      )}
    </div>
  );
}

export default Header;
