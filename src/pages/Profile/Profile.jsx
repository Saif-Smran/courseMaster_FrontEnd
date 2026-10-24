import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { getMeAsync } from "../../store/slices/authSlice";

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Not available"
        : date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
};

export default function Profile() {
    const dispatch = useDispatch();
    const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getMeAsync());
        }
    }, [dispatch, isAuthenticated, user]);

    if (loading && !user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="max-w-2xl mx-auto py-8">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const initials = user.name
        ?.split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U";
    const dashboardPath = user.role === "admin" ? "/admin" : "/student";

    return (
        <div className="max-w-4xl mx-auto py-4 sm:py-8">
            <div className="mb-6">
                <Link to={dashboardPath} className="btn btn-ghost btn-sm gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            <section className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
                <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                </div>

                <div className="card-body p-5 sm:p-8 -mt-16 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-3xl font-black border-4 border-base-100 shadow-lg">
                            {initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-black">{user.name || "CourseMaster User"}</h1>
                                <span className="badge badge-primary gap-1 capitalize">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {user.role || "student"}
                                </span>
                            </div>
                            <p className="text-base-content/70 mt-1">Your CourseMaster account</p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide font-bold text-base-content/60 mb-2">Full name</p>
                            <p className="flex items-center gap-2 font-semibold">
                                <UserRound className="w-4 h-4 text-primary" />
                                {user.name || "Not available"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide font-bold text-base-content/60 mb-2">Email address</p>
                            <p className="flex items-center gap-2 font-semibold break-all">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                {user.email || "Not available"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide font-bold text-base-content/60 mb-2">Account type</p>
                            <p className="flex items-center gap-2 font-semibold capitalize">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                {user.role || "student"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide font-bold text-base-content/60 mb-2">Member since</p>
                            <p className="flex items-center gap-2 font-semibold">
                                <CalendarDays className="w-4 h-4 text-primary" />
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link to={dashboardPath} className="btn btn-primary flex-1">
                            Go to Dashboard
                        </Link>
                        <Link to="/courses" className="btn btn-outline flex-1">
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
