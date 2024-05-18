import axios from "axios";
import { useState, useEffect } from "react";
import ShowBlogs from "./ShowBLogs";
import { useBlogs } from "../hooks/useBlog";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { blogs, setBlogs } = useBlogs();
  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/blog/getBlogs`);
        console.log(response);

        const allBlogs = response.data?.blogs?.map((blog) => ({
          ...blog,
          blogImageUrl: `https://blog-test-backend.onrender.com/api/v1/blog/${blog.blogImageUrl?.replace(
            "\\",
            "/"
          )}`,
        }));

        console.log("allBlogs", allBlogs);
        setBlogs(allBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  return (
    <div className="container mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
        </div>
      ) : (
        <ShowBlogs blogs={blogs} />
      )}
    </div>
  );
};

export default Home;
