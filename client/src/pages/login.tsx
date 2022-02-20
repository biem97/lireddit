import React from "react";
import { Button, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Container from "../components/Container";
import InputField from "../components/Input/InputField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const Login = () => {
  const [{ fetching }, login] = useLoginMutation();

  const router = useRouter();

  return (
    <Container mx="auto" py="28">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await login({
            options: value,
          });
          console.log("response:", response);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // successfully register
            router.push("/");
          }
          console.log("response: ", response);
        }}
      >
        {() => (
          <Form>
            <Box display={"flex"} flexDirection={"column"} gap={"4"}>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Button
                type="submit"
                color={"teal"}
                bgColor="teal.100"
                alignSelf={"center"}
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
