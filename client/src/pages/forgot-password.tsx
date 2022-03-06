import { Box, Button, Container, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import InputField from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import NextLink from "next/link";

const ForgotPassword = () => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Container mx="auto" py="28">
      {complete ? (
        <Flex
          alignItems="center"
          direction="column"
          gap="4"
          bgColor="teal.100"
          py="4"
        >
          <Box>An link to reset your account has been sent to your email</Box>
          <NextLink href="/login">
            <Link>Login</Link>
          </NextLink>
        </Flex>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (value) => {
            await forgotPassword({
              variables: {
                email: value.email,
              },
            });
            setComplete(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box display={"flex"} flexDirection={"column"} gap={"4"}>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                />
                <Button
                  type="submit"
                  color={"teal"}
                  bgColor="teal.100"
                  alignSelf="start"
                  isLoading={isSubmitting}
                >
                  Forgot Password
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default ForgotPassword;
