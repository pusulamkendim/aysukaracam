import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const [totalUsers, totalOrders, paidOrders, totalClasses, totalEnrollments, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.findMany({
        where: { status: "PAID" },
        select: { totalAmount: true },
      }),
      prisma.class.count({ where: { isActive: true } }),
      prisma.enrollment.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return NextResponse.json({
    totalUsers,
    totalOrders,
    totalRevenue,
    totalClasses,
    totalEnrollments,
    recentOrders,
  });
}
