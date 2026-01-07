'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function FinishSignup() {
  const [status, setStatus] = useState('Подтверждение входа...');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 1. Проверяем, является ли ссылка корректной ссылкой для входа Firebase
    if (isSignInWithEmailLink(auth, window.location.href)) {
      
      // 2. Пытаемся достать email из localStorage (который мы сохранили при отправке ссылки)
      let email = window.localStorage.getItem('emailForSignIn');

      // 3. Если пользователь открыл ссылку в другом браузере, localStorage будет пуст.
      // В этом случае нужно спросить email у пользователя снова.
      if (!email) {
        email = window.prompt('Пожалуйста, введите ваш email для подтверждения:');
      }

      if (email) {
        // 4. Завершаем вход
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            // Очищаем localStorage
            window.localStorage.removeItem('emailForSignIn');
            setStatus('Успешно! Перенаправление...');
            
            // 5. Редирект на главную страницу
            setTimeout(() => router.push('/home'), 2000);
          })
          .catch((err) => {
            console.error('Ошибка входа:', err);
            setError('Ошибка: ссылка недействительна или просрочена.');
          });
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold">{status}</h1>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-red-500 mb-4">Упс!</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Вернуться на страницу входа
            </button>
          </>
        )}
      </div>
    </div>
  );
}
