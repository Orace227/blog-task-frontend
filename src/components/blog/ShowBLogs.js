import React from "react";
import { Link } from "react-router-dom";

const ShowBlogs = ({ blogs }) => {
  const editDate = (createdAt) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date(createdAt);
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  const truncateContent = (content) => {
    return content.length > 100 ? content.substr(0, 100) + "..." : content;
  };

  return (
    <div className=" mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.length !== 0 ? (
        blogs.map((blog) => (
          <Link to={`/blog/${blog.slug}`} key={blog.blogId}>
            <div className=" rounded-lg overflow-hidden hover:shadow-lg border">
              <img
                className="w-full h-48 object-cover"
                src={`/blogImages/${blog.image}`}
                alt={blog.title}
              />
              <div className="px-6 py-4">
                <h5 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                  {blog.title}
                </h5>
                <p className="text-gray-700 text-sm mb-4 truncate">
                  {truncateContent(blog.content)}
                </p>
                <p className="text-gray-600 text-sm">
                  {editDate(blog.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="text-xl font-semibold text-gray-800">No blogs found</h1>
      )}
    </div>
  );
};

export default ShowBlogs;
