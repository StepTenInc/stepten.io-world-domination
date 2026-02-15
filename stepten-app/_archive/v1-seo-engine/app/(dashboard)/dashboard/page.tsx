import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-foreground-muted">Here&apos;s what&apos;s happening with your account.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Products Owned", value: "3", icon: "📦" },
                    { title: "Courses Enrolled", value: "2", icon: "🎓" },
                    { title: "Upcoming Bookings", value: "1", icon: "📅" },
                    { title: "Support Tickets", value: "0", icon: "🎫" },
                ].map((stat) => (
                    <Card key={stat.title} className="bg-background border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-foreground-muted">
                                {stat.title}
                            </CardTitle>
                            <span className="text-xl">{stat.icon}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-background border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground-muted">No recent activity to show.</p>
                </CardContent>
            </Card>
        </div>
    );
}
