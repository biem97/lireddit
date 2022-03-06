import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../hooks/useGetPostFromUrl";
import { createUrqlClient } from "../../utils/createUrqlClient";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";

interface PostProps {}

const Post = ({}: PostProps) => {
  const [{ data, fetching, error }] = useGetPostFromUrl();

  if (fetching) {
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
