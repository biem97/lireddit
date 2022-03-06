import React from "react";
import { Box } from "@chakra-ui/react";
import NavBar from "./NavBar";
import Wrapper from "./Wrapper";

export type LayoutVariant = "small" | "regular";

interface LayoutProps {
  variant?: LayoutVariant;
  children: React.ReactNode;
}

const Layout = ({ children, variant }: LayoutProps) => {
  return (
    <Box>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Box>
  );
};

export default Layout;
