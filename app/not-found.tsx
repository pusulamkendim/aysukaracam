import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Sayfa bulunamadı</p>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
