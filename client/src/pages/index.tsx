import { useEffect, useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

const Index = () => {
  const [pagination, setPagination] = useState({
    limit: 49,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: pagination,
  });

  const handleOnClick = () => {
    setPagination({
      limit: pagination.limit,
      cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt || null,
    });
  };

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex textAlign="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      {fetching && !data && <div>Loadingg</div>}
      {data && (
        <>
          {data.posts.posts.map((p) => (
            <Stack spacing={8} marginY={4} key={p.id}>
              <Box p={8} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Stack>
          ))}
          <Flex>
            {typeof data.posts.hasMore === "undefined" ? (
              <Box>Error</Box>
            ) : data.posts.hasMore ? (
              <Button
                onClick={handleOnClick}
                isLoading={fetching}
                m="auto"
                my={4}
              >
                Load More
              </Button>
            ) : (
              <Box>The end</Box>
            )}
          </Flex>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
