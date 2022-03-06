import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";

import React from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
}

const EditDeletePostButtons = ({ id }: EditDeletePostButtonsProps) => {
  const [_, deletePost] = useDeletePostMutation();

  return (
    <Box>
      <NextLink href={"/post/update/[id]"} as={`/post/update/${id}`}>
        <IconButton aria-label="Delete Post" mx="1">
          <EditIcon fontSize="lg" color="blue" />
        </IconButton>
      </NextLink>

      <IconButton
        aria-label="Delete Post"
        onClick={() => {
          deletePost({
            id,
          });
        }}
        mx="1"
      >
        <DeleteIcon fontSize="lg" color="tomato" />
      </IconButton>
    </Box>
  );
};

export default EditDeletePostButtons;
