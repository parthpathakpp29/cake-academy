import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";

export default function AdminDashboardContent() {
    const stats = [
        { label: 'Total Users', value: '1,234' },
        { label: 'Active Courses', value: '56' },
        { label: 'Total Revenue', value: '$12,345' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Add more admin-specific content here */}
        </div>
    )
}

