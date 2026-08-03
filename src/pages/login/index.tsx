import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setForm({
      email: "alex@timetoprogram.com",
      password: "Test@1234",
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

      navigate(
        (location.state as { from?: { pathname: string } })?.from?.pathname ??
        "/dashboard",
        {
          replace: true,
        }
      );
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
      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm animate-in">
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2.5 font-semibold"
          >
            <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl shadow-(--shadow-card)">
              <Icon
                name="bolt"
                filled={true}
                size={20}
                className="text-white"
              />
            </div>

            <span className="font-display text-lg font-bold tracking-tight">
              Flowboard
            </span>
          </Link>

          <div className="card rounded-3xl p-8 shadow-(--shadow-soft)">
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-1.5 text-sm text-muted">
              Log in to your workspace.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={fillDemo}
              >
                Use demo account
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <AuthAside
        title="Welcome back to Flowboard"
        subtitle="Log in and pick up right where you and your team left off."
      />
    </div>
  );
};

export default LoginPage;