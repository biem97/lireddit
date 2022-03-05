import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface PostProps {}

const Post = ({}: PostProps) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    console.log("err: ", error);
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  console.log("data: ", data?.post);
  return <Layout>{data?.post?.text}</Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
