import { useState } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  TextField,
  Grid,
  FormLabel,
} from "@mui/material";
// components
import { useEffect } from "react";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlog";
function BlogDetails() {
  const { slug } = useParams();
  const { filterBlogDetails } = useBlogs();
  const [blogDetails, setBlogDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setBlogs } = useBlogs();

  const navigate = useNavigate();
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
  useEffect(() => {
    const getBlogDetails = async () => {
      const blogDetails = await filterBlogDetails(slug);
      if (blogDetails) {
        setBlogDetails(blogDetails);
      } else {
        const response = await axios.get(`/blog/getBlogs?slug=${slug}`);
        // console.log(response.data.blogs);

        const blog = await response.data.blogs.map((blog) => ({
          ...blog,
          blogImageUrl: `${
            process.env.REACT_APP_AXIOS_URL
          }/blog/${blog.blogImageUrl.replace("\\", "/")}`,
        }));
        setBlogDetails(blog[0]);
      }
    };
    getBlogDetails();
  }, [slug, showModal]);

  const handleDelete = async () => {
    try {
      const body = { blogIdArr: [`${blogDetails.blogId}`] };
      const deletedBlog = await axios.post("/blog/deleteBlogs", body);
      if (deletedBlog.status === 200) {
        // console.log(deletedBlog);
        toast.success("Blog deleted successfully!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const blogValidationSchema = Yup.object().shape({
    slug: Yup.string()
      .required("Slug is required")
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly")
      .test("unique", "Slug must be unique", async (value) => {
        // You need to implement a check here to see if the slug is unique
        return true; // replace with your actual logic
      }),
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    author: Yup.string().required("Author is required"),
    tags: Yup.array().of(Yup.string()),
  });

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      const trimmedUrl = values.blogImageUrl.substring(
        values.blogImageUrl.indexOf("/blogImage")
      );
      values.blogImageUrl = trimmedUrl;
      const body = { blogId: values.blogId, updatedFields: values };
      const updateBlog = await axios.post("/blog/updateBlog", body);
      console.log(updateBlog);
      setLoading(false);
      setShowModal(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {showModal && (
        <Dialog
          open={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogContent>
            <Container>
              <Formik
                initialValues={blogDetails}
                validationSchema={blogValidationSchema}
                onSubmit={handleUpdate}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="slug"
                          as={TextField}
                          label="Slug"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name="slug"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="title"
                          as={TextField}
                          label="Title"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="content"
                          as={TextField}
                          label="Content"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          multiline
                          rows={4}
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="author"
                          as={TextField}
                          label="Author"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name="author"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} style={{ marginTop: "24px" }}>
                        <input
                          id="blogImage"
                          name="blogImage"
                          type="file"
                          onChange={(e) => {
                            setFieldValue(
                              "blogImage",
                              e.currentTarget.files[0]
                            );
                            setFieldValue(
                              "blogImageName",
                              e.currentTarget.files[0].name
                            );
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        <FormLabel htmlFor="blogImage">
                          <Button
                            variant="outlined"
                            component="span"
                            fullWidth
                            style={{ textTransform: "none" }}
                          >
                            Upload Blog Image (optional)
                          </Button>
                        </FormLabel>
                        <div>
                          {values.blogImage && values.blogImageName && (
                            <p style={{ margin: "0", paddingTop: "8px" }}>
                              Selected Image: {values.blogImageName}
                            </p>
                          )}
                        </div>
                        <ErrorMessage
                          name="blogImage"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                        <ErrorMessage
                          name="blogImageName"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="tags"
                          as={TextField}
                          label="Tags (comma separated)"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          onChange={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((tag) => tag.trim());
                            setFieldValue("tags", tags);
                          }}
                        />
                        <ErrorMessage
                          name="tags"
                          component="div"
                          className="error"
                          style={{ color: "red" }}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ marginTop: "1rem" }}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Submit"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Container>
          </DialogContent>
        </Dialog>
      )}
      <div className="container mx-auto py-8 px-4">
        {blogDetails ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold mb-4">{blogDetails.title}</h1>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="bg-gray-600  rounded-lg text-white  m-2 mr-0 py-1 px-2  hover:bg-gray-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gray-600  rounded-lg text-white   m-2 mr-0 py-1 px-2  hover:bg-gray-500"
                >
                  Delete
                </button>
              </div>
            </div>

            {blogDetails.blogImageUrl && (
              <>
                <div className="relative">
                  <img
                    src={blogDetails.blogImageUrl}
                    alt={blogDetails.title}
                    className="w-full h-auto mb-4 rounded-lg bg-black"
                  />
                  <div className="bg-gray-600 inline rounded-lg text-white  py-1 px-3  absolute right-3 bottom-3">
                    {editDate(blogDetails.createdAt)}
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center text-gray-500 text-sm">
              <p className="mr-4">Author: {blogDetails.author}</p>
              {/* <p className="mr-4">Date: {editDate(blogDetails.createdAt)}</p> */}
              <div>
                {blogDetails?.tags?.map((tag, index) => (
                  <span key={index} className="mr-2">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{blogDetails.content}</p>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </>
  );
}

export default BlogDetails;
