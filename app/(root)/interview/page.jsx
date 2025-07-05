import Agent from "@/components/Agent";
import { getCurrentUser } from "@/actions/auth.actions";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <Agent
        userName={user?.name}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;