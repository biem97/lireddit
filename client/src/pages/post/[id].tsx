import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../hooks/useGetPostFromUrl";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";

interface PostProps {}

const Post = ({}: PostProps) => {
  const { data, loading, error } = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
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
      <Heading>{data.post.title}</Heading>
      <EditDeletePostButtons id={data.post.id} />
      <Box mt={4}>{data.post.text}</Box>
    </Layout>
  );
};

export default Post;
