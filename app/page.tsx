"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, provider } from "@/app/lib/firebase"
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import FormRegistration from "./components/registration/formRegistration";
import FormLogIn from "./components/registration/formLogin";
import Modal from "./components/registration/modal";

export default function Login() {
  const [isFormLogo, setIsFormLogo] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textModal, setTextModal] = useState("")
  const [error, setError] = useState('');

  const router = useRouter();

  // 1. АВТОМАТИЧЕСКИЙ ПЕРЕХОД
  // Если пользователь уже авторизован (вернулся на сайт), 
  // Firebase найдет сессию и мы перекинем его на /home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // setIsFormLogo(false)
        // router.push("/home"); // Путь к вашей главной странице
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
      alert('create account')
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Не удалось войти через Google");
    }
  };


  // 4 registration email

  const clickLogo = () => {
    setIsFormLogo(true)

  }
  const clickRegistration = () => {
    setIsFormLogo(false)
  }

  // registration email and password
  async function handleRegister(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword');

    if (!email) {
      setIsModalOpen(true)
      setTextModal('Wpisz email')
      return;
    }
    // 1. Podstawowa walidacja po stronie serwera
    if (password !== confirmPassword) {
      setIsModalOpen(true)
      setTextModal('Hasla roznie')
      return;
    }

    if ((password).length < 6) {
      setTextModal("Hasło musi mieć minimum 8 znaków.");
      return;
    }

    // 2. Symulacja zapisu do bazy danych
    console.log("Rejestracja użytkownika:", email);

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Успешно зарегистрирован:", userCredential.user);
      // Здесь можно перенаправить пользователя: router.push('/dashboard')
    } catch (err: any) {
      // Обработка типичных ошибок Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже занят.');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль слишком слабый (минимум 6 символов).');
      } else if (err.code === 'auth/password-does-not-meet-requirements') {
        setError('politika password')
      } else
        // setError('Произошла ошибка при регистрации.');
        setError('inne');
    }
  }
  // 3. Przekierowanie po sukcesie
  // redirect('/dashboard');


  /// logowanie

  async function handleLogo(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email, password)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home')
      
    } catch (err: any) {

      switch (err.code) {
        case 'auth/invalid-credential':
          alert('Неверный email или пароль.');
          break;
        case 'auth/user-disabled':
          alert('Аккаунт заблокирован.');
          break;
        case 'auth/too-many-requests':
          alert('Слишком много попыток. Попробуйте позже.');
          break;
        default:
          alert(err)
      }
    } finally {
      console.log()
    }

  }

  return (
    
    <div className=" bg-black min-h-screen ">
      <div className="w-[98vw] bg-black-800 m-auto py-4 px-2">
        <h1 className="text-[38px] text-center text-white font-bold mb-10">Witaj!!!</h1>
        <button
          onClick={handleLogin}
          className=" flex justify-center text-[18px] font-bold gap-4 items-center w-full px-6 py-2 mb-4  bg-blue-100 rounded-lg hover:bg-blue-300 transition"
        >
          <Image
            src='/assets/icons/icons8-google-36.png'
            width={36}
            height={36}
            alt=""
            priority
          />
          Wejscie przez Google
        </button>
        <div className="text-white">{error}</div>
        {isFormLogo ? (
          <div className="">
            <h2 className="text-2xl text-white text-center font-bold mt-10 mb-12">Rejestracja przez email</h2>

            <FormRegistration
              action={handleRegister}
            />
            <p className="text-white text-[18px] font-bold">Don't have an account?
              <span
                onClick={clickRegistration}
                className="text-blue-900 ml-2">Sing In
              </span>
            </p>
          </div>
        ) : (
          <div className="">
            <h2 className="text-2xl text-white text-center font-bold mt-10 mb-12">Logowanie przez email</h2>

            <FormLogIn 
              action={handleLogo}
            />
            <p className="text-white text-[18px] font-bold">Don't have an account?
              <span
                onClick={clickLogo}
                className="text-blue-900 ml-2">Sing Up
              </span>
            </p>
          </div>
        )
        }

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Uwaga!!!"
          message={textModal}
        />
      </div>
    </div>
  );
}