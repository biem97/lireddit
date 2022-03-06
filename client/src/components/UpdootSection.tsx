import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache, gql } from "@apollo/client";
interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) return;

    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: {
        points: newPoints,
        voteStatus: value,
      },
    });
  }
};

const UpdootSection = ({ post }: UpdootSectionProps) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  const [vote] = useVoteMutation();
  const handleVote =
    (type: "updoot" | "downdoot", postId: number) => async () => {
      setLoadingState(
        type === "updoot" ? "updoot-loading" : "downdoot-loading"
      );

      const voteValue = type === "updoot" ? 1 : -1;
      await vote({
        variables: {
          postId,
          value: voteValue,
        },
        update: (cache) => updateAfterVote(voteValue, postId, cache),
      });

      setLoadingState("not-loading");
    };
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      gap={1}
    >
      <IconButton
        // variant="ghost"
        colorScheme={post.voteStatus === 1 ? "blue" : undefined}
        aria-label="Up Vote"
        icon={<ChevronUpIcon fontSize="24px" />}
        onClick={handleVote("updoot", post.id)}
        isLoading={loadingState === "updoot-loading"}
      />
      {post.points}
      <IconButton
        // variant="ghost"
        colorScheme={post.voteStatus === -1 ? "teal" : undefined}
        aria-label="Down Vote"
        isLoading={loadingState === "downdoot-loading"}
        onClick={handleVote("downdoot", post.id)}
        icon={<ChevronDownIcon fontSize="24px" />}
      />
    </Flex>
  );
};

export default UpdootSection;
