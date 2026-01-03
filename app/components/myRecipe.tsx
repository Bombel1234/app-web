'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Edit3, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";


interface dialog1 {
    onShowRecipe: (data: any) => void
}




export function MyRecipeHome({ onShowRecipe }: dialog1) {
    const dialogRef = useRef(null);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    // Синхронизация нативного элемента <dialog> со стейтом React
    //   useEffect(() => {
    //     if (isOpen) {
    //       dialogRef.current?.showModal();
    //     } else {
    //       dialogRef.current?.close();
    //     }
    //   }, [isOpen]);

    //   if (!dish) return null;

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black animate-in fade-in duration-300'>
            {/* <button
                onClick={onShowRecipe}
                className='w-full py-4 bg-orange-700 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all'
            >
                Click
            </button> */}
            <div className="min-h-screen w-full bg-gray-300 flex flex-col">
            {/* Header */}
            <header className="bg-blue-200 p-4 border-b flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.location.href = '/home'} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-xl truncate max-w-[200px] sm:max-w-md">
                        {/* {recipe.title} */}
                    </h1>
                </div>

                {/* Кнопка переключения режима */}
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all"
                    >
                        <Edit3 size={18} />
                        Edytowac
                    </button>
                )}
            </header>

            <main className="flex-grow px-2 py-6 max-w-3xl mx-auto w-full">
                {isEditing ? (
                    /* РЕЖИМ РЕДАКТИРОВАНИЯ */
                    <div className="bg-white py-6 px-2 bg-yellow-300 rounded-2xl shadow-sm space-y-4 border border-orange-200">
                        <h2 className="font-bold text-[22px] text-gray-900">Edytowanie tresci przepisu</h2>
                        <textarea
                            className="w-full min-h-[400px] border-blue-800 border-4 bg-white text-[22px] font-bold p-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/30"
                            // value={editedText}

                            // onChange={(e) => setEditedText(e.target.value)}
                            placeholder="Введите шаги приготовления..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3 border bg-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
                            >
                                <X size={18} /> Отмена
                            </button>
                            <button
                                // onClick={handleUpdate}
                                // disabled={isSaving}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-gray-300"
                            >
                                {/* {isSaving ? "Сохранение..." : <><Save size={18} /> Сохранить</>} */}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* РЕЖИМ ПРОСМОТРА */
                    <div className="bg-white p-3 rounded-2xl shadow-sm min-h-[500px]">

                        <div className="prose max-w-none text-gray-900 font-bold whitespace-pre-wrap leading-relaxed text-[22px]">
                            {/* {recipe.text} */}

                        </div>
                    </div>
                )}
            </main>
        </div>
        </div>
    );

}