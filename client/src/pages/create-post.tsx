import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";

const CreatePost = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({
                fieldName: "posts:{}",
              });
            },
          });

          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box display={"flex"} flexDirection={"column"} gap={"4"}>
              <InputField name="title" placeholder="title" label="Title" />
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
                type="text"
                textarea
              />

              <Button
                type="submit"
                color={"teal"}
                bgColor="teal.100"
                alignSelf="start"
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
