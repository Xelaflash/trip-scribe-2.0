import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-md items-center px-viewportPadding py-12">
      <div className="w-full rounded-lg border border-border bg-card text-card-foreground shadow-elevationLow">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-extrabold tracking-[0.12em] text-secondary uppercase">Trip workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-primary-950">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Continue to your trip dashboard and shared plans.</p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
