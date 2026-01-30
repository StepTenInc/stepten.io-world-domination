import { AdminLayout } from "@/components/layouts";

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
