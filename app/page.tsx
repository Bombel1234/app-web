"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, provider } from "@/app/lib/firebase"
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from 'lucide-react'


export default function Login() {
  const router = useRouter();

  // 1. АВТОМАТИЧЕСКИЙ ПЕРЕХОД
  // Если пользователь уже авторизован (вернулся на сайт), 
  // Firebase найдет сессию и мы перекинем его на /home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Пользователь найден, перенаправляем...");
        router.push("/home"); // Путь к вашей главной странице
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. ФУНКЦИЯ РЕГИСТРАЦИИ / ВХОДА Google
  const handleLogin = async () => {
    try {
      // Firebase автоматически регистрирует нового пользователя 
      // или входит в аккаунт существующего
      await signInWithPopup(auth, provider);

      // После успешного входа сработает onAuthStateChanged выше 
      // и перенаправит пользователя. Но можно продублировать и здесь:
      router.push("/home");
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Не удалось войти через Google");
    }
  };

  // 3 input password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // 4 registration email
  const clickEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const email = formData.get("email");

    // console.log(email)
  }

  return (
    <div className="flex bg-black items-center justify-center min-h-screen ">
      <div className="w-screen bg-black-800 m-auto px-2 text-center">
        <h1 className="text-[38px] text-center text-white font-bold mb-12">Witaj!!!</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-4 mb-6  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Wejscie przez Google
        </button>
        <h2 className="text-2xl text-white font-bold mt-10 mb-12">Rejestracja przez email</h2>
        <form action="" onSubmit={clickEmail}>
          <input type="email" name="email" placeholder="Enter email"
            className="px-4 mb-6 text-white text-[24px] py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 placeholder-gray-400"
          />
          <div className="flex flex-col gap-2 px-2">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                name="email"
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 text-white relative text-[24px] border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                placeholder="Введите пароль"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                className="absolute text-white w-6 h-6 right-14 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />    
                )}
              </button>
            </div>
          </div>
          <button
            
            type="submit"
            className="px-10 py-2 mt-20 text-[22px]  bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Registration
          </button>
        </form>
      </div>


    </div>
  );
}
