import { SignIn } from "@clerk/react";

const signin = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <SignIn />
    </div>
  );
};

export default signin;
