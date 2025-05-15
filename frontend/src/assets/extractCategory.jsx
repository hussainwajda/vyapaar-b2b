import { getCategories } from "./Categories";
import { useAuth } from "../context/AuthContext";

export const extractCategory = () => {
    const categories = getCategories();
    const { getCategoriesFromUser } = useAuth();
    const userCategories = getCategoriesFromUser();
    const categoryIds = userCategories.split(',').map(Number);
    const selectedCategories = categories.filter((category) => categoryIds.includes(category.id));
    return selectedCategories;
};