import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-10  w-full">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center">
          <div className="mr-4">
            <p className="text-sm">
              &copy; 2024 BHAVIN'S BLOG. All Rights Reserved
            </p>
          </div>
          <div>
            <Link href="#" className="text-sm hover:text-gray-300">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="#" className="text-sm hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
