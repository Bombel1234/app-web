'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Save } from 'lucide-react'

interface RecipeFormProps {
  onSubmitAction: (data: any) => void; 
}

export default function RecipeForm({ onSubmitAction }:RecipeFormProps) {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [title, setTitle] = useState("")
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Превращаем FormData в обычный объект
        const data = Object.fromEntries(formData.entries());

        // Передаем данные наверх родителю
        onSubmitAction(data);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-[380px]" >
            <div>
                <label className="block text-[16px] pt-6 font-black uppercase tracking-widest mb-2 ml-1">
                    Nazwa dania
                </label>
                <input
                    required
                    type="text"
                    name='title'
                    // onChange={(e) => handleChange(e)} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 text-[22px] bg-gray-300 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                />
            </div>
            <div>
                <label className="block text-[20px] font-black  tracking-widest mb-2 ml-1">
                    Tresc Przepisu
                </label>
                <textarea
                    required
                    name='valueRecipe'
                    // onChange={handleChange}
                    // onChange={(e) => handleChange(e)}  
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-[300px] p-4 text-[22px] bg-gray-300 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all resize-none text-gray-600"
                />
            </div>


            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    className="flex-[2] py-4 bg-blue-600 text-[20px] text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    Zapisz
                </button>
            </div>
        </form>
        // <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        //     <input 
        //         type="text" 
        //         value={title} 
        //         onChange={(e) => setTitle(e.target.value)}
        //         placeholder="Название рецепта"
        //         className="border p-2 rounded"
        //     />
        //     <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        //         Сохранить
        //     </button>
        // </form>
    );
}