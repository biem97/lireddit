import React from "react";
import { Button, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Container from "../components/Container";
import InputField from "../components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

const Register = () => {
  const [register, { loading }] = useRegisterMutation();
  const router = useRouter();

  return (
    <Container mx="auto" py="28">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await register({
            variables: {
              options: value,
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: "posts" });
            },
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
                isLoading={loading}
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

export default Register;
