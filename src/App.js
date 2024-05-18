import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import NotFound from "./components/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import axios from "axios";
import BlogDetails from "./components/blog/BlogDetails";
import CreateBlog from "./components/blog/CreateBlog";

const App = () => {
  axios.defaults.baseURL = "https://blog-test-backend.onrender.com/api/v1";
  axios.defaults.withCredentials = true;
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LayoutsWithHeader />}>
            <Route path="/" element={<Home />} />
            <Route path="/CreateBlog" element={<CreateBlog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

const LayoutsWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
