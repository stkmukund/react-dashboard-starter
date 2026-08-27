import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { appConfig, env } from "../../config";
import AuthAside from "../../components/auth/AuthAside";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  // Show demo button only if ?demo=true or ?demo in query params
  const showDemo = searchParams.get("demo") !== null;

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setForm({
      email: env.demoEmail || "admin@gmail.com",
      password: env.demoPassword || "admin@123",
    });
  };

  const handleChange =
    (field: keyof LoginForm) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome back!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-4 py-6 sm:py-8 lg:w-1/2">
        <div className="w-full max-w-sm animate-in">
          <Link
            to="/"
            className="mb-5 sm:mb-6 flex items-center justify-center gap-2.5 font-semibold"
          >
            <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-2xl shadow-(--shadow-card)">
              <Icon
                name={appConfig.logoIcon}
                filled={true}
                size={18}
                className="text-white"
              />
            </div>

            <span className="font-display text-lg font-bold tracking-tight">
              {appConfig.name}
            </span>
          </Link>

          <div className="card rounded-3xl p-6 sm:p-7 shadow-(--shadow-soft)">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Log in to your workspace.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange("email")}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange("password")}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Log in
              </Button>

              {showDemo && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full animate-in"
                  onClick={fillDemo}
                >
                  Use demo account
                </Button>
              )}
            </form>
          </div>

          {(searchParams.get("register") !== null || searchParams.get("signup") !== null || searchParams.get("demo") !== null) && (
            <p className="mt-4 text-center text-xs sm:text-sm text-muted-foreground animate-in">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>

      <AuthAside
        title={`Welcome back to ${appConfig.name}`}
        subtitle="Sign in securely to manage your applications, insights, and global operations."
        badgeText="Enterprise-grade security & reliability"
        badgeIcon="verified_user"
      />
    </div>
  );
};

export default LoginPage;