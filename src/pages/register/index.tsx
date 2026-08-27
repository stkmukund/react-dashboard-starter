import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { appConfig } from "../../config";
import AuthAside from "../../components/auth/AuthAside";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);

        try {
            await register(form);
            toast.success("Account created!");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || "Something went wrong");
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
                            Create your account
                        </h1>

                        <p className="mt-1 text-xs sm:text-sm text-muted">
                            Start managing projects with AI.
                        </p>

                        <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
                            <Input
                                id="name"
                                label="Full name"
                                placeholder="Ada Lovelace"
                                autoComplete="name"
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />

                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="you@company.com"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                loading={loading}
                            >
                                Create account
                            </Button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-primary hover:text-primary-hover"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            <AuthAside
                title="Create your account & get started"
                subtitle="Join thousands of teams and creators building scalable solutions worldwide."
                badgeText="Global infrastructure · 99.99% uptime"
                badgeIcon="public"
            />
        </div>
    );
};

export default RegisterPage;