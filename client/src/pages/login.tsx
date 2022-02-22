import React from "react";
import { Button, Box, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Container from "../components/Container";
import InputField from "../components/Input/InputField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

const Login = () => {
  const [{ fetching }, login] = useLoginMutation();

  const router = useRouter();

  return (
    <Container mx="auto" py="28">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await login({
            usernameOrEmail: value.usernameOrEmail,
            password: value.password,
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // successfully register
            router.push("/");
          }
        }}
      >
        {() => (
          <Form>
            <Box display={"flex"} flexDirection={"column"} gap={"4"}>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or Email"
                label="Username or Email"
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <NextLink href="/forgot-password">
                <Link alignSelf="end">Forgot Password?</Link>
              </NextLink>
              <Button
                type="submit"
                color={"teal"}
                bgColor="teal.100"
                alignSelf="start"
                isLoading={fetching}
              >
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
