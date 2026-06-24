import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <div className="mx-auto mt-28 mb-6 max-w-md space-y-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
