import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection = ({ post }: UpdootSectionProps) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  const [vote] = useVoteMutation();
  const handleVote =
    (type: "updoot" | "downdoot", postId: number) => async () => {
      if (
        (type === "downdoot" && post.voteStatus === -1) ||
        (type === "updoot" && post.voteStatus === 1)
      )
        return;

      setLoadingState(
        type === "updoot" ? "updoot-loading" : "downdoot-loading"
      );

      await vote({
        variables: {
          postId,
          value: type === "updoot" ? 1 : -1,
        },
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
      <Text>{post.points}</Text>
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
