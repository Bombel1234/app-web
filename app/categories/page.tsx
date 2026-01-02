"use client";

import { useRouter } from "next/navigation";
import { Plus, ChevronLeft } from "lucide-react";
import Image from "next/image";
import {auth, db } from "@/app/lib/firebase"
import { doc, getDocs, collection, query, where, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";




export default function CategoriesPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);

  // Переход на страницу добавления с параметром категории
  const handleAddClick = (categorySlug: string) => {
    router.push(`/add-recipe?category=${encodeURIComponent(categorySlug)}`);
  };



  async function fetchAllImages() {
    const querySnapshot = await getDocs(collection(db, "images"));

    // .map() проходит по каждому документу и создает объект
    const imagesArray = querySnapshot.docs.map(doc => ({
      id: doc.id,       // извлекаем ID документа ("1", "2" и т.д.)
      ...doc.data()     // разворачиваем все поля документа (url, title и т.д.)
    }));
    setImages(imagesArray)
    return imagesArray;
  }
  fetchAllImages()


  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="p-6 bg-white border-b mb-6">
        <h1 className="text-[32px] font-bold text-gray-900">Wybor kategorii</h1>
        <p className="text-gray-500 text-[19px]">Wybierz kategorije zeby dodac przepis</p>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-6">
          {images.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Изображение категории */}
              <div className="relative  w-full overflow-hidden">
                <img
                  src={cat.image}

                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-[24px] font-bold">{cat.category}</h2>
                  {/* <p className="text-xs opacity-80">{cat.count}</p> */}
                </div>
              </div>

              {/* Контент карточки */}
              <div className="p-5 flex items-center justify-between">
                <button
                  onClick={() => router.push(`/home`)}
                  className="text-gray-600 font-medium flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  Powrot<ChevronLeft size={36} />
                </button>
                <button
                  // onClick={() => router.push(`/home`)}

                  className="text-gray-600 font-medium flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  Image<Plus size={36} />
                </button>

                {/* Кнопка записи блюда */}
                <button
                  onClick={() => handleAddClick(cat.category)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                  <Plus size={20} />
                  Zapisz
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


