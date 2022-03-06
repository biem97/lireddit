import { Container, Box, Button, Link, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useState } from "react";
import InputField from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Container mx="auto" py="28">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: value.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // successfully change password
            router.push("/");
          }
        }}
      >
        {() => (
          <Form>
            <Box display={"flex"} flexDirection={"column"} gap={"4"}>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
              {tokenError && (
                <Flex gap="5" alignItems="center">
                  <Box color="red">{tokenError}</Box>
                  <NextLink href="/forgot-password">
                    <Link>Forget Link</Link>
                  </NextLink>
                </Flex>
              )}
              <Button
                type="submit"
                color={"teal"}
                bgColor="teal.100"
                alignSelf={"start"}
              >
                Change Password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ChangePassword;
