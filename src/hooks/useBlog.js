import React, { createContext, useContext, useState } from "react";

// Create a context
const blogContext = createContext();

// Create a context provider
export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  console.log(blogs);
  const filterBlogDetails = (slug) => {
    return blogs.find((blog) => blog.slug === slug);
  };
  return (
    <blogContext.Provider value={{ blogs, setBlogs, filterBlogDetails }}>
      {children}
    </blogContext.Provider>
  );
};

// Custom hook to consume the context
export const useBlogs = () => {
  const context = useContext(blogContext);

  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }

  return context;
};
