import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
  Grid,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const blogValidationSchema = Yup.object().shape({
  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly")
    .test("unique", "Slug must be unique", async (value) => {
      try {
        const slugExist = await axios.get(
          `/blog/checkSlugAvailable?slug=${value}`
        );
        console.log(slugExist);
        if (slugExist.status === 200) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  author: Yup.string().required("Author is required"),
  blogImage: Yup.mixed().required("Blog image is Required"),
  blogImageName: Yup.string().required("Blog image Name is Required"),
  tags: Yup.array().of(Yup.string()),
});

const initialValues = {
  slug: "",
  title: "",
  content: "",
  author: "",
  blogImageName: "",
  blogImage: {},
  tags: [""],
};

const uploadBlogImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("bannerImage", image);
    const uploadedImage = await axios.post("/blog/uploadBlogImage", formData);
    toast.success("Image uploaded successfully!");
    // console.log(uploadedImage);
    return uploadedImage.data.path;
  } catch (error) {
    console.log(error);
  }
};
const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log(values);
      const blogImagePath = await uploadBlogImage(values.blogImage);
      // console.log(blogImagePath);
      if (blogImagePath) {
        delete values.blogImage;
        const body = values;
        body.blogImageUrl = blogImagePath;
        const createBlog = await axios.post("/blog/createBlog", body);
        console.log(createBlog);
        toast.success("Blog is created successfully!");
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster />
      <Typography variant="h4" gutterBottom>
        Create Blog
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={blogValidationSchema}
        onSubmit={handleSubmit}
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
                    setFieldValue("blogImage", e.currentTarget.files[0]);
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
                    Upload Blog Image
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
  );
};

export default CreateBlog;
