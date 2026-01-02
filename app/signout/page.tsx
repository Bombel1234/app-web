"use client";

import { auth } from "@/app/lib/firebase"; // Путь к вашему конфигу Firebase
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";



export default function LogoutPage() {
    const router = useRouter();
    const [UserId, setUserId] = useState<string | null>(null);
    const [Email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
            if (user) {
                setEmail(user.email)
            }
            
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            console.log(UserId)
            await signOut(auth);
            // После выхода перенаправляем на страницу регистрации или входа
            router.push("/");
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full text-center">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut className="text-red-500" size={32} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Выход из системы</h1>
                <h2 className="font-bold text-blue-500 py-2">{Email}</h2>
                <p className="text-gray-500 mb-8">Napewno chcesz wylogowac sie?</p>

                <div className="space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Tak, potwierdzam
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-3 bg-white text-gray-700 border border-gray-400 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Wycofac sie
                    </button>
                </div>
            </div>
        </div>
    );
}
