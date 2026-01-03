"use client";

import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, Save } from "lucide-react";
import Image from "next/image";
import { auth, db } from "@/app/lib/firebase"
import { doc, getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {RecipeForm} from "@/app/components/addRecipeForm"
import { X } from "lucide-react"




export default function CategoriesPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null)

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);

    });
    return () => unsubscribe();
  }, []);

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

  const clickAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!userId) return;
      const recipesRef = collection(db, "users", userId, "recipes");
      await addDoc(recipesRef, {
        title: title,
        supportText: "supportText",
        category: category,
        text: value,
        createdAt: serverTimestamp(),
      });

      router.push("/home");
      setCategory(null)
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
    }

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
                  type="submit"
                >
                  <Plus size={20} />
                  Zapisz
                </button>
              </div>
            </div>
          ))}
        </div>
        {category && (
          <div className="fixed inset-0 w-screen z-[10] h-screen flex items-center justify-center p-4 bg-white animate-in fade-in duration-300">
            <div className="block w-full">
              <div className="">
                <div className="flex mb-5">
                  <div className="">
                    <h1 className="text-[24px] text-black font-bold">Dodaj przepis do kategorii:
                    </h1>
                    <p className="text-[22px] font-bold italic text-blue-900">{category}</p>
                  </div>
                  <button
                    // onClick={() => setEditingRecipe(null)}
                    className="absolute right-6 top-3 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-center  text-black">
                <form className="space-y-6 w-full" onSubmit={clickAddRecipe}>
                  <label className="text-[22px]  font-bold uppercase tracking-widest ml-1">
                    Nazwa dania
                  </label>
                  <input
                    required
                    type="text"
                    name='title'
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 mb-2 text-[22px] bg-gray-300 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800" />

                  <label className="text-[22px] font-bold uppercase tracking-widest mb-2 ml-1">
                    Tresc Przepisu
                  </label>
                  <textarea
                    required
                    name='valueRecipe'
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-[300px] p-4 text-[22px] bg-gray-200 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all resize-none text-gray-600"
                  />



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


