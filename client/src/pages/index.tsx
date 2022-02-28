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
  IconButton,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
  const [pagination, setPagination] = useState({
    limit: 5,
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
      {fetching && !data ? (
        <div>Loadingg</div>
      ) : (
        <>
          <Stack spacing={8} marginY={4}>
            {data!.posts.posts.map((p) => (
              <Flex key={p.id} p={8} shadow="md" borderWidth="1px" gap={5}>
                <UpdootSection post={p} />
                <Box>
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text
                    mt={1}
                    fontWeight={200}
                    fontSize={"sm"}
                    color="gray.400"
                  >
                    Posted by {p.creator.username}
                  </Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
          <Flex>
            {typeof data!.posts.hasMore === "undefined" ? (
              <Box>Error</Box>
            ) : data!.posts.hasMore ? (
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
