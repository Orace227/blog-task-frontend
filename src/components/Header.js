import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-500 text-white py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="hover:text-gray-300">
          <h1 className="text-2xl font-bold">Blog Test</h1>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/CreateBlog" className="hover:text-gray-300">
                Create Blog
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-300">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
