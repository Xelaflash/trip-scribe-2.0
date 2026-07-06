import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <div className="mx-auto flex w-full max-w-md items-center px-viewportPadding py-20">
      <div className="w-full rounded-3xl border border-border bg-card text-card-foreground shadow-elevationLow  min-h-60">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-extrabold tracking-[0.12em] text-secondary uppercase">Trip workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-card-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Continue to your trip dashboard and shared plans.</p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// grid min-h-60 gap-4 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-elevationLow
