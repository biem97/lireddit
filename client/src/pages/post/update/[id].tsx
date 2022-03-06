import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import { useGetPostFromUrl } from "../../../hooks/useGetPostFromUrl";
import { useIsAuth } from "../../../hooks/useIsAuth";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useRouter } from "next/router";

interface UpdatePostProps {}

const UpdatePost = ({}: UpdatePostProps) => {
  useIsAuth();
  const router = useRouter();
  const [{ data, fetching, error }] = useGetPostFromUrl();
  const [_, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <div>Loading... </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>Error</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const postId = data.post?.id;
          await updatePost({
            updatePostId: postId ? postId : -1,
            ...values,
          });

          router.back();
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
                Update Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(UpdatePost);
