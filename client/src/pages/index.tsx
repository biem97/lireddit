import { useState } from "react";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
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

import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = () => {
  const [pagination, setPagination] = useState({
    limit: 5,
    cursor: null as null | string,
  });
  const { data, loading, error } = usePostsQuery({
    variables: pagination,
  });
  const { data: meData } = useMeQuery();

  const handleOnClick = () => {
    setPagination({
      limit: pagination.limit,
      cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt || null,
    });
  };

  if (!loading && !data) {
    console.log("error: ", error);
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex textAlign="center">
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      {loading && !data ? (
        <div>Loadingg</div>
      ) : (
        <>
          <Stack spacing={8} marginY={4}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={8} shadow="md" borderWidth="1px" gap={5}>
                  <UpdootSection post={p} />
                  <Box flexGrow={1}>
                    <Flex justify="space-between" align="center">
                      <NextLink href={"/post/[id]"} as={`/post/${p.id}`}>
                        <Link mr={100}>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      {meData?.me?.id === p.creator.id && (
                        <EditDeletePostButtons id={p.id} />
                      )}
                    </Flex>

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
              )
            )}
          </Stack>
          <Flex>
            {typeof data!.posts.hasMore === "undefined" ? (
              <Box>Error</Box>
            ) : data!.posts.hasMore ? (
              <Button
                onClick={handleOnClick}
                isLoading={loading}
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

export default Index;
