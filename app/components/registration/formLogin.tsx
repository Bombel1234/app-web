import { useState, useActionState } from "react";
import { Eye, EyeOff } from 'lucide-react'

interface FormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export default function FormLogIn({action}:FormProps){
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [state, formAction, isPending] = useActionState(action, null);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    return (
        <form action={formAction}>
          <input type="email" name="email" placeholder="Enter email"
            className="px-4 mb-6 w-full text-white text-[18px] py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 placeholder-gray-400"
          />
          <div className="flex w-full justify-center">
            <div className="relative w-full text-center" >
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                name="email"
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 w-full relative py-2 text-white text-[18px] border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                placeholder="Wpisz haslo"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                className="absolute mr-4 text-white w-6 h-6 right-0 top-1/2 -translate-y-1/2 text-gray-500 hover: focus:outline-none"
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
            className="px-10 py-2 mt-10 mb-13 w-full text-[22px]  bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Log In
          </button>
          
        </form>
    )
}