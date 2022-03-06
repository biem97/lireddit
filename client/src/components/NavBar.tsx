import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar = ({}: NavBarProps) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery();

  return (
    <Flex bg="tan" p={4} ml={"auto"}>
      <NextLink href={"/"}>
        <Link>
          <Heading fontSize="xl" color="blue.500">
            LiReddit
          </Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>
        {data?.me ? (
          <Flex>
            <Box mx={2}>Hi {data.me.username}</Box>
            <Button
              mx={2}
              variant="link"
              onClick={() => {
                logout();
              }}
              isLoading={logoutFetching}
            >
              Log Out
            </Button>
          </Flex>
        ) : (
          <>
            <NextLink href="/login">
              <Link mx="2">Login</Link>
            </NextLink>

            <NextLink href="/register">
              <Link mx="2">Register</Link>
            </NextLink>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default NavBar;