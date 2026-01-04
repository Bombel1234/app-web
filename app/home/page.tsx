"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { auth, db } from "@/app/lib/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  Clock,
  ChevronDown,
  Edit2, Edit3,
  Trash2,
  MoreVertical,
  Save, X,
  Settings, User, LogOut, UtensilsCrossed, Plus
} from "lucide-react";

import { collection, onSnapshot, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { MyRecipeHome } from "@/app/components/myRecipe"




const CATEGORIES = [
  { id: 0, name: "Wszystkie" },
  { id: 1, name: "Pierwsze dania" },
  { id: 2, name: "Drugie dania" },
  { id: 3, name: "Ryby" },
  { id: 4, name: "Przystawki" },
  { id: 5, name: "Salatki" },
  { id: 6, name: "Ciasta" },
  { id: 7, name: "Desery" },
  { id: 8, name: "Drozrzdiowe" },
  { id: 9, name: "Inne" }
];


export default function Home() {

  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingRecipe, setEditingRecipe] = useState<{ id: string, title: string, category: string } | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<any>(null);

  const [deletingRecipe, setdeletingRecipe] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [idRecipe, setIdRecipe] = useState('')

  ///////////////////////////////components/////////

  const [recipe, setRecipe] = useState<{ title: string, text: string } | null>(null);
  const [title, setTitle] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState<{ id1: string, id2: string } | null>(null)
  const router = useRouter();
  // 1. Получаем ID пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      if (!user) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Слушаем Firestore в реальном времени
  useEffect(() => {
    if (!userId) return;

    const recipesRef = collection(db, "users", userId, "recipes");
    const unsubscribe = onSnapshot(recipesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // 3. Фильтрация данных (зависит от выбора в select)
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === "Wszystkie") return recipes;
    return recipes.filter(item => item.category === selectedCategory);
  }, [selectedCategory, recipes]);

  if (loading) return (

    <div className="text-center p-30">Download...</div>

  );

  // 4. Dialog update

  const openUpdateDialog = (e: React.MouseEvent, recipe: any) => {
    e.stopPropagation()
    setEditingRecipe(recipe);
    setCurrentRecipe({ ...recipe });
  }
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const titleValue = formData.get("title");
    const supportTextValue = formData.get("supportText");
    if (!userId || !currentRecipe) return;

    try {
      const recipeRef = doc(db, "users", userId, "recipes", currentRecipe.id);

      await updateDoc(recipeRef, {
        title: titleValue,
        supportText: supportTextValue
      });


      setEditingRecipe(null);
    } catch (error) {

      alert("Не удалось обновить рецепт");
    }
  };

  // 5.Dialog delete
  const openDeleteDialog = (e: React.MouseEvent, recipeId: any) => {
    setdeletingRecipe(recipeId)
    e.stopPropagation()
  }
  const deleteRecipe = async (id: any) => {
    setdeletingRecipe(false)

    try {
      if (!userId) return;
      // Ссылка на конкретный документ рецепта
      const recipeRef = doc(db, 'users', userId, 'recipes', id)
      // Удаление из Firestore
      await deleteDoc(recipeRef);


    } catch (error) {
      alert("Не удалось удалить рецепт.");
    }
  }
  // 5. singOut

  const singOutUser = () => {
    window.location.href = '/signout'
  }
  // 6 Add Recipe
  const addRecipe = () => {
    window.location.href = '/categories'

  }
  // 7 Text Recipe

  const textRecipe = null;
  const clickRecipe = async (id: string, cat: string) => {
    setIdRecipe(id)
    try {
      if (!userId) return;
      const docRef = doc(db, "users", userId, "recipes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('test', data)
        setRecipe({ title: data.title, text: data.text })

      }
    } catch {

    } finally {

    }
  }
  const updateRecipe = async (text1: any) => {
    try {
      if (!userId) return;
      const docRef = doc(db, "users", userId, "recipes", idRecipe);
      console.log(docRef)
      await updateDoc(docRef, {
        text: text1
      });
      setRecipe(null)
    
    } catch (e) {
      alert("Ошибка при сохранении");
    } finally {
      console.log('finally')
    }

  }


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">

      {/* --- HEADER (Только для этой страницы) --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto bg-blue-400 px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl">
              <UtensilsCrossed className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900">
              RECIPES<span className="text-orange-500">.</span>
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
          >
            <MoreVertical size={36} className="text-black-800" />
          </button>
          {/* Выпадающее меню (Dropdown) */}
          {isMenuOpen && (
            <>
              {/* Невидимая подложка для закрытия меню при клике вне его */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              ></div>

              <div className="absolute right-6 top-10 mt-2 w-58 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 overflow-hidden">
                <button
                  onClick={addRecipe}
                  className="flex items-center text-[22px] w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <Plus size={26} className="mr-3" />
                  Dodaj przepis
                </button>
                <button className="flex items-center text-[22px] w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                  <User size={26} className="mr-3" />
                  Moj profil
                </button>
                <button className="flex items-center text-[22px] w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                  <Settings size={26} className="mr-3" />
                  Ustawienia
                </button>
                <hr className="my-1 border-gray-50" />
                <button
                  onClick={singOutUser}
                  className="flex items-center w-full text-[22px] px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={26} className="mr-3" />
                  Wyloguj sie
                </button>
              </div>
            </>
          )}
        </div>
        {/* --- SELECTOR (ВЫБОР КАТЕГОРИИ) --- */}
        <div className="mb-10 p-5">
          <label className="block text-xs mb-5 text-gray-700 uppercase text-[22px] font-bold">
            Kategorii dan
          </label>
          <div className="relative group text-[22px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-red-400 py-2 px-6 rounded-3xl text-gray-800 font-bold shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors pointer-events-none" />
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="flex-grow  overflow-y-auto no-scrollbar">
        <div className="p-2">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => clickRecipe(recipe.id, recipe.category)}
              className="bg-cyan-100 p-5 rounded-2xl shadow-sm border border-green-700 mb-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold mt-3 text-gray-800">{recipe.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{recipe.supportText}</p>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => openUpdateDialog(e, recipe)}
                      className="p-1 text-green-800 hover:text-green-500 transition-colors">
                      <Edit2 size={28} />
                    </button>
                    <button
                      onClick={(e) => openDeleteDialog(e, recipe.id)}
                      className="p-1 text-red-800 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={28} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-500 flex items-center text-gray-700 text-xs">
                <Clock size={18} className="mr-1" />
                {recipe.createdAt?.toDate ? recipe.createdAt.toDate().toLocaleDateString() : "Недавно"}
              </div>
            </div>
          ))}

        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-20 text-black">
            Brak przepisow w kategorii "{selectedCategory}"
          </div>
        )}

      </main>
      {/* --- МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ --- */}
      {editingRecipe && currentRecipe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">

          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative">

            {/* Кнопка закрытия */}
            <button
              onClick={() => setEditingRecipe(null)}
              className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Заголовок окна */}
            <div className="mb-8 text-center">
              <div className="inline-block p-4 rounded-2xl bg-blue-50 text-blue-500 mb-4">
                <Edit3 size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-800">Aktualiowac przepis</h2>
              <p className="text-gray-400 text-sm mt-1">Zmien szczuguly swego dania</p>
            </div>

            <form className="space-y-6" onSubmit={handleUpdate}>
              {/* Поле названия */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Tytul przepisu
                </label>
                <input
                  required
                  type="text"
                  name='title'
                  defaultValue={currentRecipe.title}
                  className="w-full p-4 bg-gray-300 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                />
              </div>

              {/* Поле Support Text (Дополнительная информация) */}
              <div>
                <label className="block text-xs font-black  text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Krotki opis (Support Text)
                </label>
                <textarea
                  defaultValue={currentRecipe.supportText}
                  name='supportText'
                  placeholder="Przyklad: Przepis z youtube"
                  rows={3}
                  className="w-full p-4 bg-gray-300 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all resize-none text-gray-600"
                />
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ДИАЛОГ ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ --- */}
      {deletingRecipe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Wykasowac przepis?</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {/* Вы действительно хотите удалить <span className="font-bold text-gray-800">«{deletingRecipe.title}»</span>? */}

              Ta czynnosc nie mozna odwolac
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  deleteRecipe(deletingRecipe)
                }}
                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
              >
                Tak, wykasowac
              </button>

              <button
                onClick={() => setdeletingRecipe(false)}
                className="w-full py-4 bg-gray-300 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                Odrzuc
              </button>
            </div>

          </div>
        </div>
      )}
      {recipe && (
        <MyRecipeHome
          dish={recipe}
          handleUpdate={updateRecipe}
        />
      )}



      {/* --- FOOTER (Только для этой страницы) --- */}
      <footer className="bg-blue-400 border-t border-gray-100 py-4 text-center">
        <p className="text-gray-700  text-sm">© 2025 Glowna strona. Firebase</p>
      </footer>
    </div >

  )
}