import React from "react";
import { Button, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Container from "../components/Container";
import InputField from "../components/Input/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Register = () => {
  const [{ fetching }, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Container mx="auto" py="28">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await register({
            options: value,
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // successfully register
            router.push("/");
          }
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
              <InputField name="email" placeholder="Email" label="Email" />
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
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
