import "../index.css";
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
        <header className="fixed top-0 w-full mx-auto bg-red-500">
          <div className="flex items-center justify-evenly ">
            <div>
              <ul className="list-none flex">
                <li>Posters</li>
              </ul>
            </div>
            <div>
              <ul className="list-none flex items-center  justify-end gap-4">
                <li className="p-2">
                  <Link to="/compilation">Home</Link>
                </li>
                <li className="p-2">
                  <Link to="/success">Your Posts</Link>
                </li>
                <li className="p-2">
                  <Link to="/createposts">Create new posts</Link>
                </li>
                <li className="p-2">Contact</li>
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
      ) : (
        <header className="fixed top-0 w-full mx-auto bg-red-500">
          <div className="flex items-center justify-evenly ">
            <div>
              <ul className="list-none flex">
                <li>Posters</li>
              </ul>
            </div>
            <ul className="list-none flex justify-end gap-4 align-top">
              <li className="p-2">
                <Link to="/compilation">All Posts</Link>
              </li>
              <li className="p-2">About</li>
            </ul>

            <button
              className="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded"
              onClick={signOutUser}
            >
              Login Page
            </button>
          </div>
        </header>
      )}
    </div>
  );
}

export default Header;
