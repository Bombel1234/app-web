"use client";

import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, Save } from "lucide-react";
import Image from "next/image";
import { auth, db } from "@/app/lib/firebase"
import { doc, getDocs, collection, query, where, getCountFromServer } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {RecipeForm} from "@/app/components/addRecipeForm"




export default function CategoriesPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null)
  // const [loading, setLoading] = useState(true);

  // Переход на страницу добавления с параметром категории
  const handleAddClick = (cat: string) => {
    // router.push(`/add-recipe?category=${encodeURIComponent(categorySlug)}`);
    setCategory(cat)
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

  const clickAddRecipe = () => {
    setCategory(null)
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="p-6 bg-white border-b mb-6 bg=gray-300">
        <h1 className="text-[32px] font-bold text-gray-900">Wybor kategorii</h1>
        <p className="text-gray-500 text-[19px]">Wybierz kategorije zeby dodac przepis</p>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-6">
          {images.map((cat) => (
            <div
              key={cat.id}
              className="group relative mb-4 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
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
        {category && (
          <div className="fixed inset-0 z-[100] h-screen flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full h-screen">
              <div className="flex justify-center mx-auto px-4 text-black">
                <form className="space-y-6 w-[380px]" onSubmit={clickAddRecipe}>

                  <div>
                    <div>
                      <h1 className="text-[28px] font-bold">Dodaj przepis do kategorii:
                      </h1>
                      <p>{category}</p>
                    </div>

                    <label className="block text-[16px] pt-6 font-black uppercase tracking-widest mb-2 ml-1">
                      Nazwa dania
                    </label>
                    <input
                      required
                      type="text"
                      name='title'
                      // onChange={(e) => setTitle(e.target.value)}
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
                      // onChange={(e) => setvalueRecipe(e.target.value)}
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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


