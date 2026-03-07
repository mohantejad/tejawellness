"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Search, Sparkles, Filter, Leaf, Utensils, ShoppingBag, BookOpen, Calendar, ArrowRight, ChevronDown } from "lucide-react";
import type { Goal } from "@/types/goals";
import { fetchRecipesByGoal } from "@/api/recipes";
import { fetchIngredientsByGoal } from "@/api/ingredients";
import { fetchProductsByGoal } from "@/api/products";
import { fetchArticlesByGoal } from "@/api/articles";
import { fetchMealPlansByGoal } from "@/api/meal-plans";

import RecipeCard from "@/components/recipes/RecipeCard";
import IngredientCard from "@/components/ingredients/IngredientCard";
import ProductCard from "@/components/products/ProductCard";
import ArticleCard from "@/components/articles/ArticleCard";
import MealPlanCard from "@/components/meal-plans/MealPlanCard";

type ContentTab = "all" | "recipes" | "ingredients" | "products" | "articles" | "meal-plans";

interface CategoryState {
    items: any[];
    page: number;
    hasMore: boolean;
}

export default function GoalSanctuaryClient({ goal }: { goal: Goal }) {
    const [activeTab, setActiveTab] = useState<ContentTab>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    // Per-category pagination state
    const [recipes, setRecipes] = useState<CategoryState>({ items: [], page: 1, hasMore: true });
    const [ingredients, setIngredients] = useState<CategoryState>({ items: [], page: 1, hasMore: true });
    const [products, setProducts] = useState<CategoryState>({ items: [], page: 1, hasMore: true });
    const [articles, setArticles] = useState<CategoryState>({ items: [], page: 1, hasMore: true });
    const [mealPlans, setMealPlans] = useState<CategoryState>({ items: [], page: 1, hasMore: true });

    const tabs = [
        { id: "all", label: "All Wisdom", icon: Sparkles },
        { id: "recipes", label: "Recipes", icon: Utensils },
        { id: "ingredients", label: "Ingredients", icon: Leaf },
        { id: "products", label: "Apothecary", icon: ShoppingBag },
        { id: "articles", label: "Articles", icon: BookOpen },
        { id: "meal-plans", label: "Meal Plans", icon: Calendar },
    ];

    const resetAll = useCallback(() => {
        setRecipes({ items: [], page: 1, hasMore: true });
        setIngredients({ items: [], page: 1, hasMore: true });
        setProducts({ items: [], page: 1, hasMore: true });
        setArticles({ items: [], page: 1, hasMore: true });
        setMealPlans({ items: [], page: 1, hasMore: true });
        setVisibleCount(12);
    }, []);

    const fetchData = async (isInitial = true) => {
        if (isInitial) {
            setLoading(true);
            resetAll();
        } else {
            setLoadingMore(true);
        }

        try {
            const filters = searchQuery ? { search: searchQuery } : {};

            // Target counts for "All Wisdom" pro-rata if we want to interleave exactly.
            // However, it's better to fetch pages and then interleave whatever we got.

            const fetchProtos = [];

            if (activeTab === "all" || activeTab === "recipes") {
                const p = recipes.page + (isInitial ? 0 : 0); // Logic below handles increment
                fetchProtos.push(fetchRecipesByGoal(goal.slug, { ...filters, page: isInitial ? 1 : recipes.page + 1 }).then(res => ({ type: 'recipes', data: res })));
            }
            if (activeTab === "all" || activeTab === "ingredients") {
                fetchProtos.push(fetchIngredientsByGoal(goal.slug, isInitial ? 1 : ingredients.page + 1, filters).then(res => ({ type: 'ingredients', data: res })));
            }
            if (activeTab === "all" || activeTab === "products") {
                fetchProtos.push(fetchProductsByGoal(goal.slug, filters, isInitial ? 1 : products.page + 1).then(res => ({ type: 'products', data: res })));
            }
            if (activeTab === "all" || activeTab === "articles") {
                fetchProtos.push(fetchArticlesByGoal(goal.slug, { ...filters, page: isInitial ? 1 : articles.page + 1 }).then(res => ({ type: 'articles', data: res })));
            }
            if (activeTab === "all" || activeTab === "meal-plans") {
                fetchProtos.push(fetchMealPlansByGoal(goal.slug, { ...filters, page: isInitial ? 1 : mealPlans.page + 1 }).then(res => ({ type: 'meal-plans', data: res })));
            }

            const results = await Promise.all(fetchProtos);

            results.forEach(res => {
                const items = Array.isArray(res.data) ? res.data : (res.data.results || []);
                const next = !Array.isArray(res.data) && res.data.next;
                const hasMore = !!next || items.length === 15; // Assumption based on PAGE_SIZE=15

                if (res.type === 'recipes') {
                    setRecipes(prev => ({
                        items: isInitial ? items : [...prev.items, ...items],
                        page: isInitial ? 1 : prev.page + 1,
                        hasMore
                    }));
                } else if (res.type === 'ingredients') {
                    setIngredients(prev => ({
                        items: isInitial ? items : [...prev.items, ...items],
                        page: isInitial ? 1 : prev.page + 1,
                        hasMore
                    }));
                } else if (res.type === 'products') {
                    setProducts(prev => ({
                        items: isInitial ? items : [...prev.items, ...items],
                        page: isInitial ? 1 : prev.page + 1,
                        hasMore
                    }));
                } else if (res.type === 'articles') {
                    setArticles(prev => ({
                        items: isInitial ? items : [...prev.items, ...items],
                        page: isInitial ? 1 : prev.page + 1,
                        hasMore
                    }));
                } else if (res.type === 'meal-plans') {
                    setMealPlans(prev => ({
                        items: isInitial ? items : [...prev.items, ...items],
                        page: isInitial ? 1 : prev.page + 1,
                        hasMore
                    }));
                }
            });

        } catch (error) {
            console.error("Error fetching sanctuary content:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData(true);
    }, [goal.slug, searchQuery, activeTab]);

    // Interleaving logic for "All Wisdom"
    const interleavedAll = useMemo(() => {
        if (activeTab !== "all") return [];

        const r = recipes.items.map(i => ({ ...i, type: 'recipe' }));
        const ing = ingredients.items.map(i => ({ ...i, type: 'ingredient' }));
        const p = products.items.map(i => ({ ...i, type: 'product' }));
        const a = articles.items.map(i => ({ ...i, type: 'article' }));
        const m = mealPlans.items.map(i => ({ ...i, type: 'meal-plan' }));

        const combined: any[] = [];
        const maxLen = Math.max(r.length, ing.length, p.length, a.length, m.length);

        // Interleave in a specific order: Recipe, Ingredient, Product, Article, Meal Plan
        for (let i = 0; i < maxLen; i++) {
            if (r[i]) combined.push(r[i]);
            if (ing[i]) combined.push(ing[i]);
            if (p[i]) combined.push(p[i]);
            if (a[i]) combined.push(a[i]);
            if (m[i]) combined.push(m[i]);
        }

        return combined;
    }, [recipes.items, ingredients.items, products.items, articles.items, mealPlans.items, activeTab]);

    const handleLoadMore = () => {
        if (activeTab === "all") {
            // If we still have more items in the interleaved list, just show more
            if (visibleCount < interleavedAll.length) {
                setVisibleCount(prev => prev + 12);
            } else {
                // Otherwise, fetch next page for all active categories
                fetchData(false);
                setVisibleCount(prev => prev + 12);
            }
        } else {
            fetchData(false);
        }
    };

    const getHasMore = () => {
        if (activeTab === "all") {
            return recipes.hasMore || ingredients.hasMore || products.hasMore || articles.hasMore || mealPlans.hasMore || visibleCount < interleavedAll.length;
        }
        if (activeTab === "recipes") return recipes.hasMore;
        if (activeTab === "ingredients") return ingredients.hasMore;
        if (activeTab === "products") return products.hasMore;
        if (activeTab === "articles") return articles.hasMore;
        if (activeTab === "meal-plans") return mealPlans.hasMore;
        return false;
    };

    const currentItems = () => {
        if (activeTab === "all") return interleavedAll.slice(0, visibleCount);
        if (activeTab === "recipes") return recipes.items;
        if (activeTab === "ingredients") return ingredients.items;
        if (activeTab === "products") return products.items;
        if (activeTab === "articles") return articles.items;
        if (activeTab === "meal-plans") return mealPlans.items;
        return [];
    };

    const renderGrid = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-80 rounded-[2rem] bg-surface/50 animate-pulse" />
                    ))}
                </div>
            );
        }

        const items = currentItems();
        if (items.length === 0) return <NoResults />;

        return (
            <div className="space-y-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
                    {items.map((item, idx) => (
                        <div key={`${item.type || activeTab}-${item.id}`} style={{ animationDelay: `${idx * 50}ms` }}>
                            {(item.type === 'recipe' || activeTab === 'recipes') && <RecipeCard recipe={item} />}
                            {(item.type === 'ingredient' || activeTab === 'ingredients') && <IngredientCard ingredient={item} />}
                            {(item.type === 'product' || activeTab === 'products') && <ProductCard product={item} />}
                            {(item.type === 'article' || activeTab === 'articles') && <ArticleCard article={item} />}
                            {(item.type === 'meal-plan' || activeTab === 'meal-plans') && <MealPlanCard plan={item} />}
                        </div>
                    ))}
                </div>

                {getHasMore() && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="group flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-mutedForeground hover:text-primary transition-all duration-500"
                        >
                            {loadingMore ? (
                                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Experience More
                                    <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-rose">
                                        <ChevronDown size={18} />
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="container-page py-20 space-y-16">
            {/* Search & Filter Header */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
                <div className="relative w-full max-w-xl group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-mutedForeground group-focus-within:text-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search rituals for ${goal.name}...`}
                        className="w-full bg-white border border-border/60 rounded-full py-5 pl-16 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-rose"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full xl:w-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ContentTab)}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-500 border-none shadow-soft ${activeTab === tab.id
                                ? "bg-primary text-white shadow-rose scale-105"
                                : "bg-white text-mutedForeground hover:bg-surface hover:text-primary"
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="min-h-[600px]">
                {renderGrid()}
            </div>
        </section>
    );
}

function NoResults() {
    return (
        <div className="flex flex-col items-center justify-center py-40 space-y-6 text-center">
            <div className="h-20 w-20 rounded-full bg-surface flex items-center justify-center text-primary/40">
                <Search size={32} />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-fg">No Rituals Found</h3>
                <p className="text-mutedForeground font-serif italic max-w-sm">"Even in the quietest archives, wisdom waits to be rediscovered."</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] pt-4"
            >
                Refresh Library
            </button>
        </div>
    );
}
